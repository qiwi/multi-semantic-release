import { createRequire } from "module";

export default async (cliFlags) => {
	const require = createRequire(import.meta.url);

	// Imports.
	const getPackagePaths = (await import("../lib/getPackagePaths.js")).default;
	const getConfigMultiSemrel = (await import("../lib/getConfigMultiSemrel.js")).default;
	const multiSemanticRelease = (await import("../lib/multiSemanticRelease.js")).default;
	const multisemrelPkgJson = require("../package.json");
	const semrelPkgJson = require("semantic-release/package.json");

	// Get directory.
	const cwd = process.cwd();

	// Catch errors.
	try {
		const flags = await getConfigMultiSemrel(cwd, cliFlags);

		if (flags.debug) {
			require("debug").enable("msr:*");
		}

		console.log(`multi-semantic-release version: ${multisemrelPkgJson.version}`);
		console.log(`semantic-release version: ${semrelPkgJson.version}`);
		console.log(`flags: ${JSON.stringify(flags, null, 2)}`);

		// Get list of package.json paths according to workspaces.
		const paths = getPackagePaths(cwd, flags.ignorePackages);
		console.log("package paths", paths);

		// Do multirelease (log out any errors).
		multiSemanticRelease(paths, {}, { cwd }, flags).then(
			() => {
				// Success.
				process.exit(0);
			},
			(error) => {
				// Log out errors.
				console.error(`[multi-semantic-release]:`, error);
				process.exit(1);
			}
		);
	} catch (error) {
		// Log out errors.
		console.error(`[multi-semantic-release]:`, error);
		// process.exit(1);
	}
};
