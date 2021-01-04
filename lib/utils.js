/**
 * Lifted and tweaked from semantic-release because we follow how they bump their packages/dependencies.
 * https://github.com/semantic-release/semantic-release/blob/master/lib/utils.js
 */

const { gt, lt, prerelease, rcompare } = require("semver");

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
 * @param {integer} type (default as 1) Determines which type of verification is due (highest as 1, lowest as 0).
 * @returns {string|undefined} Highest or lowest version.
 * @internal
 */
function getHighestLowest(version1, version2, type = 1) {
	if (version1 && version2) return type ? _applyHL(gt, version1, version2) : _applyHL(lt, version1, version2);
	else return version1 || version2;
}

/**
 * HOC that applies highest/lowest semver function.
 * @param {Function} fn High onder function to be called.
 * @param {string|undefined} version1 Version 1 to be compared with.
 * @param {string|undefined} version2 Version 2 to be compared with.
 * @returns {string|undefined} Highest or lowest version.
 * @internal
 */
function _applyHL(fn, version1, version2) {
	if (!fn) return version1 || version2;
	return fn(version1, version2) ? version1 : version2;
}

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

module.exports = {
	tagsToVersions,
	getHighestLowest,
	getLatestVersion,
};
