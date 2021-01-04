const execa = require("execa");

/**
 * Get all the tags for a given branch.
 *
 * @param {String} branch The branch for which to retrieve the tags.
 * @param {Object} [execaOptions] Options to pass to `execa`.
 * @param {Array<String>} filters List of prefixes/sufixes to be checked inside tags.
 *
 * @return {Array<String>} List of git tags.
 * @throws {Error} If the `git` command fails.
 * @internal
 */
function getTags(branch, execaOptions, filters) {
	let tags = execa.sync("git", ["tag", "--merged", branch], execaOptions).stdout;
	tags = tags
		.split("\n")
		.map((tag) => tag.trim())
		.filter(Boolean);

	if (!filters || !filters.length) return tags;

	const validateSubstr = (str, l) => {
		let isSubstrInside = true;
		l.forEach((f) => {
			if (!str.includes(f)) isSubstrInside = false;
		});
		return isSubstrInside;
	};

	return tags.filter((tag) => validateSubstr(tag, filters));
}

module.exports = {
	getTags,
};
