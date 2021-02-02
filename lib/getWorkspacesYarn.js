const getManifest = require("./getManifest");
const glob = require("./glob");
const { checker } = require("./blork");

/**
 * Return array of package.json for Yarn workspaces.
 *
 * @param {string} cwd The current working directory where a package.json file can be found.
 * @param {string[]|null} ignorePackages (Optional) Packages to be ignored passed via cli.
 * @returns {string[]} An array of package.json files corresponding to the workspaces setting in package.json
 */
function getWorkspacesYarn(cwd, ignorePackages = null) {
	// Load package.json
	const manifest = getManifest(`${cwd}/package.json`);

	let packages = manifest.workspaces;
	if (packages && packages.packages) {
		packages = packages.packages;
	}

	// Only continue if manifest.workspaces or manifest.workspaces.packages is an array of strings.
	if (!checker("string[]+")(packages)) {
		throw new TypeError("package.json: workspaces or workspaces.packages: Must be non-empty array of string");
	}

	// Ignore packages via CLI or via manifest workspaces
	// Ignore node_modules and only push ignored workspace.packages if no args have been passed via CLI
	const _ignorePackages = ["**/node_modules/**"];
	if (Array.isArray(ignorePackages)) _ignorePackages.push(...ignorePackages);
	else _ignorePackages.push(...packages.filter((p) => /^!/.test(p)).map((p) => p.replace("!", "")));

	// Remove ignoredPackages from packages
	if (_ignorePackages.length > 1) packages = packages.filter((p) => !/^!/.test(p));

	// Turn workspaces into list of package.json files.
	const workspaces = glob(
		packages.map((p) => p.replace(/\/?$/, "/package.json")),
		{
			cwd: cwd,
			realpath: true,
			ignore: _ignorePackages,
		}
	);

	// Must have at least one workspace.
	if (!workspaces.length) throw new TypeError("package.json: workspaces: Must contain one or more workspaces");

	// Return.
	return workspaces;
}

// Exports.
module.exports = getWorkspacesYarn;
