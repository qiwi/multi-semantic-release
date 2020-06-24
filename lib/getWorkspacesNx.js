const glob = require("bash-glob");
const getManifest = require("./getManifest");
const { existsSync, lstatSync, readFileSync } = require("fs");

/**
 * Return array of workspace.json for Yarn workspaces.
 *
 * @param {string} cwd The current working directory where a workspace.json file can be found.
 * @returns {string[]} An array of workspace.json files corresponding to the workspaces setting in workspace.json
 */
function getWorkspacesNx(cwd) {
	const path = `${cwd}/workspace.json`;
	// Check it exists.
	if (!existsSync(path)) throw new ReferenceError(`package.json file not found: "${path}"`);

	// Stat the file.
	let stat;
	try {
		stat = lstatSync(path);
	} catch (_) {
		// istanbul ignore next (hard to test — happens if no read acccess etc).
		throw new ReferenceError(`package.json cannot be read: "${path}"`);
	}

	// Check it's a file!
	if (!stat.isFile()) throw new ReferenceError(`package.json is not a file: "${path}"`);

	// Read the file.
	let contents;
	try {
		contents = readFileSync(path, "utf8");
	} catch (_) {
		// istanbul ignore next (hard to test — happens if no read access etc).
		throw new ReferenceError(`package.json cannot be read: "${path}"`);
	}

	// Parse the file.
	let manifest;
	try {
		manifest = JSON.parse(contents);
	} catch (_) {
		throw new SyntaxError(`package.json could not be parsed: "${path}"`);
	}

	// Must be an object.
	if (typeof manifest !== "object") throw new SyntaxError(`package.json was not an object: "${path}"`);

	// Turn workspaces into list of workspace.json files.
	const workspaces = glob.sync(
		Object.keys(manifest.projects).reduce((acc, key) => {
			try {
				if (key.match(/e2e/)) {
					return acc;
				}
				const pathSub = `${cwd}/${manifest.projects[key].root}/package.json`;
				getManifest(pathSub);
				return [...acc, pathSub];
			} catch (error) {
				return acc;
			}
		}, []),
		{
			cwd: cwd,
			realpath: true,
			ignore: "**/node_modules/**",
		}
	);

	// Must have at least one workspace.
	if (!workspaces.length) throw new TypeError("workspaces: Must contain one or more workspaces");

	// Return.
	return workspaces;
}

// Exports.
module.exports = getWorkspacesNx;
