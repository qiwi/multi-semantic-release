/**
 * Lifted and tweaked from semantic-release because we follow how they bump their packages/dependencies.
 * https://github.com/semantic-release/semantic-release/blob/master/lib/utils.js
 */

const semver = require("semver");

/**
 * Get tag objects and convert them to a list of stringified versions.
 * @param {array} tags Tags as object list.
 * @returns {array} Tags as string list.
 * @internal
 */
function tagsToVersions(tags) {
	if (!tags) tags = [];
	return tags.map(({ version }) => version);
}

/**
 * Validates between two versions which is the highest.
 * @param {string|undefined} version1 Version 1 to be compared with.
 * @param {string|undefined} version2 Version 2 to be compared with.
 * @returns {string|undefined} Highest version.
 * @internal
 */
function highest(version1, version2) {
	if (version1 && version2) {
		return semver.gt(version1, version2) ? version1 : version2;
	} else {
		return version1 || version2;
	}
}

/**
 * Validates between two versions which is the lowest.
 * @param {string|undefined} version1 Version 1 to be compared with.
 * @param {string|undefined} version2 Version 2 to be compared with.
 * @returns {string|undefined} Lowest version.
 * @internal
 */
function lowest(version1, version2) {
	if (version1 && version2) {
		return semver.lt(version1, version2) ? version1 : version2;
	} else {
		return version1 || version2;
	}
}

/**
 * Retrieve the latest version from a list of versions.
 * @param {array} versions Versions as string list.
 * @param {bool|undefined} withPrerelease Prerelease flag.
 * @returns {string|undefined} Latest version.
 * @internal
 */
function getLatestVersion(versions, withPrerelease) {
	return versions.filter((version) => withPrerelease || !semver.prerelease(version)).sort(semver.rcompare)[0];
}

module.exports = {
	tagsToVersions,
	highest,
	lowest,
	getLatestVersion,
};
