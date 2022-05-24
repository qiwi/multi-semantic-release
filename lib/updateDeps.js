import { writeFileSync } from "fs";
import dbg from "debug";
import semver from "semver";
import { isObject, isEqual, transform } from "lodash-es";
import recognizeFormat from "./recognizeFormat.js";
import getManifest from "./getManifest.js";
import { getHighestVersion, getLatestVersion } from "./utils.js";
import { getTags } from "./git.js";

const debug = dbg("msr:updateDeps");

/**
 * Resolve next package version.
 *
 * @param {Package} pkg Package object.
 * @returns {string|undefined} Next pkg version.
 * @internal
 */
const getNextVersion = (pkg) => {
	const lastVersion = pkg._lastRelease && pkg._lastRelease.version;

	return lastVersion && typeof pkg._nextType === "string"
		? semver.inc(lastVersion, pkg._nextType)
		: lastVersion || "1.0.0";
};

/**
 * Resolve the package version from a tag
 *
 * @param {Package} pkg Package object.
 * @param {string} tag The tag containing the version to resolve
 * @returns {string|null} The version of the package or null if no tag was passed
 * @internal
 */
const getVersionFromTag = (pkg, tag) => {
	if (!pkg.name) return tag || null;
	if (!tag) return null;

	// TODO inherit semantic-release/lib/branches/get-tags.js
	const strMatch = tag.match(/[0-9].[0-9].[0-9][^+]*/);
	return strMatch && strMatch[0] && semver.valid(strMatch[0]) ? strMatch[0] : null;
};

/**
 * Resolve next package version on prereleases.
 *
 * @param {Package} pkg Package object.
 * @param {Array<string>} tags Override list of tags from specific pkg and branch.
 * @returns {string|undefined} Next pkg version.
 * @internal
 */
const getNextPreVersion = (pkg, tags) => {
	const tagFilters = [pkg._preRelease];
	const lastVersion = pkg._lastRelease && pkg._lastRelease.version;

	// Extract tags:
	// 1. Set filter to extract only package tags
	// 2. Get tags from a branch considering the filters established
	// 3. Resolve the versions from the tags
	// TODO: replace {cwd: '.'} with multiContext.cwd
	if (pkg.name) tagFilters.push(pkg.name);
	if (!tags) {
		try {
			tags = getTags(pkg._branch, { cwd: process.cwd() }, tagFilters);
		} catch (e) {
			tags = [];
			console.warn(e);
			console.warn(`Try 'git pull ${pkg._branch}'`);
		}
	}

	const lastPreRelTag = getPreReleaseTag(lastVersion);
	const isNewPreRelTag = lastPreRelTag && lastPreRelTag !== pkg._preRelease;

	const versionToSet =
		isNewPreRelTag || !lastVersion
			? `1.0.0-${pkg._preRelease}.1`
			: _nextPreVersionCases(
					tags.map((tag) => getVersionFromTag(pkg, tag)).filter((tag) => tag),
					lastVersion,
					pkg._nextType,
					pkg._preRelease
			  );

	return versionToSet;
};

/**
 * Parse the prerelease tag from a semver version.
 *
 * @param {string} version Semver version in a string format.
 * @returns {string|null} preReleaseTag Version prerelease tag or null.
 * @internal
 */
const getPreReleaseTag = (version) => {
	const parsed = semver.parse(version);
	if (!parsed) return null;
	return parsed.prerelease[0] || null;
};

/**
 * Resolve next prerelease special cases: highest version from tags or major/minor/patch.
 *
 * @param {Array} tags List of all released tags from package.
 * @param {string} lastVersion Last package version released.
 * @param {string} pkgNextType Next type evaluated for the next package type.
 * @param {string} pkgPreRelease Package prerelease suffix.
 * @returns {string|undefined} Next pkg version.
 * @internal
 */
const _nextPreVersionCases = (tags, lastVersion, pkgNextType, pkgPreRelease) => {
	// Case 1: Normal release on last version and is now converted to a prerelease
	if (!semver.prerelease(lastVersion)) {
		const { major, minor, patch } = semver.parse(lastVersion);
		return `${semver.inc(`${major}.${minor}.${patch}`, pkgNextType || "patch")}-${pkgPreRelease}.1`;
	}

	// Case 2: Validates version with tags
	const latestTag = getLatestVersion(tags, { withPrerelease: true });
	return _nextPreHighestVersion(latestTag, lastVersion, pkgPreRelease);
};

/**
 * Resolve next prerelease comparing bumped tags versions with last version.
 *
 * @param {string|null} latestTag Last released tag from branch or null if non-existent.
 * @param {string} lastVersion Last version released.
 * @param {string} pkgPreRelease Prerelease tag from package to-be-released.
 * @returns {string} Next pkg version.
 * @internal
 */
const _nextPreHighestVersion = (latestTag, lastVersion, pkgPreRelease) => {
	const bumpFromTags = latestTag ? semver.inc(latestTag, "prerelease", pkgPreRelease) : null;
	const bumpFromLast = semver.inc(lastVersion, "prerelease", pkgPreRelease);

	return bumpFromTags ? getHighestVersion(bumpFromLast, bumpFromTags) : bumpFromLast;
};

/**
 * Resolve package release type taking into account the cascading dependency update.
 *
 * @param {Package} pkg Package object.
 * @param {string|undefined} bumpStrategy Dependency resolution strategy: override, satisfy, inherit.
 * @param {string|undefined} releaseStrategy Release type triggered by deps updating: patch, minor, major, inherit.
 * @param {Package[]} ignore=[] Packages to ignore (to prevent infinite loops).
 * @param {string} prefix Dependency version prefix to be attached if `bumpStrategy='override'`. ^ | ~ | '' (defaults to empty string)
 * @returns {string|undefined} Resolved release type.
 * @internal
 */
const resolveReleaseType = (pkg, bumpStrategy = "override", releaseStrategy = "patch", ignore = [], prefix = "") => {
	// NOTE This fn also updates pkg deps, so it must be invoked anyway.
	const dependentReleaseType = getDependentRelease(pkg, bumpStrategy, releaseStrategy, ignore, prefix);

	// Release type found by commitAnalyzer.
	if (pkg._nextType) {
		return pkg._nextType;
	}

	if (!dependentReleaseType) {
		return undefined;
	}

	// Define release type for dependent package if any of its deps changes.
	// `patch`, `minor`, `major` — strictly declare the release type that occurs when any dependency is updated.
	// `inherit` — applies the "highest" release of updated deps to the package.
	// For example, if any dep has a breaking change, `major` release will be applied to the all dependants up the chain.

	pkg._nextType = releaseStrategy === "inherit" ? dependentReleaseType : releaseStrategy;

	return pkg._nextType;
};

/**
 * Get dependent release type by recursive scanning and updating pkg deps.
 *
 * @param {Package} pkg The package with local deps to check.
 * @param {string} bumpStrategy Dependency resolution strategy: override, satisfy, inherit.
 * @param {string} releaseStrategy Release type triggered by deps updating: patch, minor, major, inherit.
 * @param {Package[]} ignore Packages to ignore (to prevent infinite loops).
 * @param {string} prefix Dependency version prefix to be attached if `bumpStrategy='override'`. ^ | ~ | '' (defaults to empty string)
 * @returns {string|undefined} Returns the highest release type if found, undefined otherwise
 * @internal
 */
const getDependentRelease = (pkg, bumpStrategy, releaseStrategy, ignore, prefix) => {
	const severityOrder = ["patch", "minor", "major"];
	const { localDeps, manifest = {} } = pkg;
	const lastVersion = pkg._lastRelease && pkg._lastRelease.version;
	const { dependencies = {}, devDependencies = {}, peerDependencies = {}, optionalDependencies = {} } = manifest;
	const scopes = [dependencies, devDependencies, peerDependencies, optionalDependencies];
	const bumpDependency = (scope, name, nextVersion) => {
		const currentVersion = scope[name];
		if (!nextVersion || !currentVersion) {
			return false;
		}

		const resolvedVersion = resolveNextVersion(currentVersion, nextVersion, releaseStrategy, prefix);
		if (currentVersion !== resolvedVersion) {
			scope[name] = resolvedVersion;
			return true;
		}

		return false;
	};

	// prettier-ignore
	return localDeps
		.filter((p) => !ignore.includes(p))
		.reduce((releaseType, p) => {
			// Has changed if...
			// 1. Any local dep package itself has changed
			// 2. Any local dep package has local deps that have changed.
			const nextType = resolveReleaseType(p, bumpStrategy, releaseStrategy,[...ignore, pkg], prefix);
			const nextVersion =
					nextType
						// Update the nextVersion only if there is a next type to be bumped
						? p._preRelease ? getNextPreVersion(p) : getNextVersion(p)
						// Set the nextVersion fallback to the last local dependency package last version
						: p._lastRelease && p._lastRelease.version

			// 3. And this change should correspond to the manifest updating rule.
			const requireRelease = scopes
				.reduce((res, scope) => bumpDependency(scope, p.name, nextVersion) || res, !lastVersion)
			return requireRelease && (severityOrder.indexOf(nextType) > severityOrder.indexOf(releaseType))
				? nextType
				: releaseType;
		}, undefined);
};

/**
 * Resolve next version of dependency.
 *
 * @param {string} currentVersion Current dep version
 * @param {string} nextVersion Next release type: patch, minor, major
 * @param {string|undefined} strategy Resolution strategy: inherit, override, satisfy
 * @param {string} prefix Dependency version prefix to be attached if `bumpStrategy='override'`. ^ | ~ | '' (defaults to empty string)
 * @returns {string} Next dependency version
 * @internal
 */
const resolveNextVersion = (currentVersion, nextVersion, strategy = "override", prefix = "") => {
	// Check the next pkg version against its current references.
	// If it matches (`*` matches to any, `1.1.0` matches `1.1.x`, `1.5.0` matches to `^1.0.0` and so on)
	// release will not be triggered, if not `override` strategy will be applied instead.
	if ((strategy === "satisfy" || strategy === "inherit") && semver.satisfies(nextVersion, currentVersion)) {
		return currentVersion;
	}

	// `inherit` will try to follow the current declaration version/range.
	// `~1.0.0` + `minor` turns into `~1.1.0`, `1.x` + `major` gives `2.x`,
	// but `1.x` + `minor` gives `1.x` so there will be no release, etc.
	if (strategy === "inherit") {
		const sep = ".";
		const nextChunks = nextVersion.split(sep);
		const currentChunks = currentVersion.split(sep);
		// prettier-ignore
		const resolvedChunks = currentChunks.map((chunk, i) =>
			nextChunks[i]
				? chunk.replace(/\d+/, nextChunks[i])
				: chunk
		);

		return resolvedChunks.join(sep);
	}

	// "override"
	// By default next package version would be set as is for the all dependants.
	return prefix + nextVersion;
};

/**
 * Update pkg deps.
 *
 * @param {Package} pkg The package this function is being called on.
 * @returns {undefined}
 * @internal
 */
const updateManifestDeps = (pkg) => {
	const { manifest, path } = pkg;
	const { indent, trailingWhitespace } = recognizeFormat(manifest.__contents__);

	// We need to bump pkg.version for correct yarn.lock update
	// https://github.com/qiwi/multi-semantic-release/issues/58
	manifest.version = pkg._nextRelease.version || manifest.version;

	// Loop through localDeps to verify release consistency.
	pkg.localDeps.forEach((d) => {
		// Get version of dependency.
		const release = d._nextRelease || d._lastRelease;

		// Cannot establish version.
		if (!release || !release.version)
			throw Error(`Cannot release because dependency ${d.name} has not been released`);
	});

	if (!auditManifestChanges(manifest, path)) {
		return;
	}

	// Write package.json back out.
	writeFileSync(path, JSON.stringify(manifest, null, indent) + trailingWhitespace);
};

// https://gist.github.com/Yimiprod/7ee176597fef230d1451
const difference = (object, base) =>
	transform(object, (result, value, key) => {
		if (!isEqual(value, base[key])) {
			result[key] =
				isObject(value) && isObject(base[key]) ? difference(value, base[key]) : `${base[key]} → ${value}`;
		}
	});

/**
 * Clarify what exactly was changed in manifest file.
 * @param {object} actualManifest manifest object
 * @param {string} path manifest path
 * @returns {boolean} has changed or not
 * @internal
 */
const auditManifestChanges = (actualManifest, path) => {
	const debugPrefix = `[${actualManifest.name}]`;
	const oldManifest = getManifest(path);
	const depScopes = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"];
	const changes = depScopes.reduce((res, scope) => {
		const diff = difference(actualManifest[scope], oldManifest[scope]);

		if (Object.keys(diff).length) {
			res[scope] = diff;
		}

		return res;
	}, {});

	debug(debugPrefix, "package.json path=", path);

	if (Object.keys(changes).length) {
		debug(debugPrefix, "changes=", changes);
		return true;
	}

	debug(debugPrefix, "no deps changes");
	return false;
};

export {
	getNextVersion,
	getNextPreVersion,
	getPreReleaseTag,
	updateManifestDeps,
	resolveReleaseType,
	resolveNextVersion,
	getVersionFromTag,
};
