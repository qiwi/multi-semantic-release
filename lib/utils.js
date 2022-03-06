/**
 * Lifted and tweaked from semantic-release because we follow how they bump their packages/dependencies.
 * https://github.com/semantic-release/semantic-release/blob/master/lib/utils.js
 */

import semver from "semver";
const { gt, lt, prerelease, rcompare } = semver;

/**
 * Get tag objects and convert them to a list of stringified versions.
 * @param {array} tags Tags as object list.
 * @returns {array} Tags as string list.
 * @internal
 */
function tagsToVersions(tags) {
	if (!tags) return [];
	return tags.map(({ version }) => version);
}

/**
 * HOC that applies highest/lowest semver function.
 * @param {Function} predicate High order function to be called.
 * @param {string|undefined} version1 Version 1 to be compared with.
 * @param {string|undefined} version2 Version 2 to be compared with.
 * @returns {string|undefined} Highest or lowest version.
 * @internal
 */
const _selectVersionBy = (predicate, version1, version2) => {
	if (predicate && version1 && version2) {
		return predicate(version1, version2) ? version1 : version2;
	}
	return version1 || version2;
};

/**
 * Gets highest semver function binding gt to the HOC selectVersionBy.
 */
const getHighestVersion = _selectVersionBy.bind(null, gt);

/**
 * Gets lowest semver function binding gt to the HOC selectVersionBy.
 */
const getLowestVersion = _selectVersionBy.bind(null, lt);

/**
 * Retrieve the latest version from a list of versions.
 * @param {array} versions Versions as string list.
 * @param {bool|undefined} withPrerelease Prerelease flag.
 * @returns {string|undefined} Latest version.
 * @internal
 */
function getLatestVersion(versions, withPrerelease) {
	return versions.filter((version) => withPrerelease || !prerelease(version)).sort(rcompare)[0];
}

// https://github.com/sindresorhus/slash/blob/b5cdd12272f94cfc37c01ac9c2b4e22973e258e5/index.js#L1
function slash(path) {
	const isExtendedLengthPath = /^\\\\\?\\/.test(path);
	const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex

	if (isExtendedLengthPath || hasNonAscii) {
		return path;
	}

	return path.replace(/\\/g, "/");
}

export { tagsToVersions, getHighestVersion, getLowestVersion, getLatestVersion, slash };
