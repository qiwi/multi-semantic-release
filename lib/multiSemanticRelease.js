import semanticRelease from "semantic-release";
import { uniq, template } from "lodash-es";
import { topo } from "@semrel-extra/topo";
import { dirname, join } from "path";

import { check } from "./blork.js";
import getLogger from "./getLogger.js";
import getConfig from "./getConfig.js";
import getConfigSemantic from "./getConfigSemantic.js";
import getManifest from "./getManifest.js";
import cleanPath from "./cleanPath.js";
import RescopedStream from "./RescopedStream.js";
import createInlinePluginCreator from "./createInlinePluginCreator.js";

/**
 * The multirelease context.
 * @typedef MultiContext
 * @param {Package[]} packages Array of all packages in this multirelease.
 * @param {Package[]} releasing Array of packages that will release.
 * @param {string} cwd The current working directory.
 * @param {Object} env The environment variables.
 * @param {Logger} logger The logger for the multirelease.
 * @param {Stream} stdout The output stream for this multirelease.
 * @param {Stream} stderr The error stream for this multirelease.
 */

/**
 * Details about an individual package in a multirelease
 * @typedef Package
 * @param {string} path String path to `package.json` for the package.
 * @param {string} dir The working directory for the package.
 * @param {string} name The name of the package, e.g. `my-amazing-package`
 * @param {string[]} deps Array of all dependency package names for the package (merging dependencies, devDependencies, peerDependencies).
 * @param {Package[]} localDeps Array of local dependencies this package relies on.
 * @param {context|void} context The semantic-release context for this package's release (filled in once semantic-release runs).
 * @param {undefined|Result|false} result The result of semantic-release (object with lastRelease, nextRelease, commits, releases), false if this package was skipped (no changes or similar), or undefined if the package's release hasn't completed yet.
 */

/**
 * Perform a multirelease.
 *
 * @param {string[]} paths An array of paths to package.json files.
 * @param {Object} inputOptions An object containing semantic-release options.
 * @param {Object} settings An object containing: cwd, env, stdout, stderr (mainly for configuring tests).
 * @param {Object} _flags Argv flags.
 * @returns {Promise<Package[]>} Promise that resolves to a list of package objects with `result` property describing whether it released or not.
 */
async function multiSemanticRelease(
	paths,
	inputOptions = {},
	{ cwd = process.cwd(), env = process.env, stdout = process.stdout, stderr = process.stderr } = {},
	_flags
) {
	// Check params.
	check(paths, "paths: string[]");
	check(cwd, "cwd: directory");
	check(env, "env: objectlike");
	check(stdout, "stdout: stream");
	check(stderr, "stderr: stream");
	cwd = cleanPath(cwd);

	// Start.
	const logger = getLogger({ stdout, stderr });
	logger.complete(`Started multirelease! Loading ${paths.length} packages...`);

	// Vars.
	const flags = normalizeFlags(_flags);
	const globalOptions = await getConfig(cwd);
	const multiContext = { globalOptions, inputOptions, cwd, env, stdout, stderr };
	const workspaces = [
		...(getManifest(join(cwd, "package.json")).workspaces || []),
		...(Array.isArray(flags.ignorePackages) ? flags.ignorePackages.map((p) => `!${p}`) : []),
	];
	const { queue } = await topo({
		cwd,
		workspaces,
		filter: ({ manifest }) => !flags.ignorePrivate || !manifest.private,
	});

	// Load packages from paths.
	const packages = await Promise.all(paths.map((path) => getPackage(path, multiContext)));
	packages.forEach((pkg) => {
		// Once we load all the packages we can find their cross refs
		// Make a list of local dependencies.
		// Map dependency names (e.g. my-awesome-dep) to their actual package objects in the packages array.
		pkg.localDeps = uniq(pkg.deps.map((d) => packages.find((p) => d === p.name)).filter(Boolean));

		logger.success(`Loaded package ${pkg.name}`);
	});

	logger.complete(`Queued ${queue.length} packages! Starting release...`);

	// Release all packages.
	const createInlinePlugin = createInlinePluginCreator(packages, multiContext, flags);
	const released = await queue.reduce(async (_m, _name) => {
		const m = await _m;
		const pkg = packages.find(({ name }) => name === _name);
		if (pkg) {
			const { result } = await releasePackage(pkg, createInlinePlugin, multiContext, flags);
			if (result) {
				return m + 1;
			}
		}

		return m;
	}, 0);

	// Return packages list.
	logger.complete(`Released ${released} of ${queue.length} packages, semantically!`);
	return packages;
}

/**
 * Load details about a package.
 *
 * @param {string} path The path to load details about.
 * @param {Object} allOptions Options that apply to all packages.
 * @param {MultiContext} multiContext Context object for the multirelease.
 * @returns {Promise<Package|void>} A package object, or void if the package was skipped.
 *
 * @internal
 */
async function getPackage(path, { globalOptions, inputOptions, env, cwd, stdout, stderr }) {
	// Make path absolute.
	path = cleanPath(path, cwd);
	const dir = dirname(path);

	// Get package.json file contents.
	const manifest = getManifest(path);
	const name = manifest.name;

	// Combine list of all dependency names.
	const deps = Object.keys({
		...manifest.dependencies,
		...manifest.devDependencies,
		...manifest.peerDependencies,
		...manifest.optionalDependencies,
	});

	// Load the package-specific options.
	const pkgOptions = await getConfig(dir);

	// The 'final options' are the global options merged with package-specific options.
	// We merge this ourselves because package-specific options can override global options.
	const finalOptions = Object.assign({}, globalOptions, pkgOptions, inputOptions);

	// Make a fake logger so semantic-release's get-config doesn't fail.
	const logger = { error() {}, log() {} };

	// Use semantic-release's internal config with the final options (now we have the right `options.plugins` setting) to get the plugins object and the options including defaults.
	// We need this so we can call e.g. plugins.analyzeCommit() to be able to affect the input and output of the whole set of plugins.
	const { options, plugins } = await getConfigSemantic({ cwd: dir, env, stdout, stderr, logger }, finalOptions);

	// Return package object.
	return { path, dir, name, manifest, deps, options, plugins, loggerRef: logger };
}

/**
 * Release an individual package.
 *
 * @param {Package} pkg The specific package.
 * @param {Function} createInlinePlugin A function that creates an inline plugin.
 * @param {MultiContext} multiContext Context object for the multirelease.
 * @param {Object} flags Argv flags.
 * @returns {Promise<void>} Promise that resolves when done.
 *
 * @internal
 */
async function releasePackage(pkg, createInlinePlugin, multiContext, flags) {
	// Vars.
	const { options: pkgOptions, name, dir } = pkg;
	const { env, stdout, stderr } = multiContext;

	// Make an 'inline plugin' for this package.
	// The inline plugin is the only plugin we call semanticRelease() with.
	// The inline plugin functions then call e.g. plugins.analyzeCommits() manually and sometimes manipulate the responses.
	const inlinePlugin = createInlinePlugin(pkg);

	// Set the options that we call semanticRelease() with.
	// This consists of:
	// - The global options (e.g. from the top level package.json)
	// - The package options (e.g. from the specific package's package.json)
	const options = { ...pkgOptions, ...inlinePlugin };

	// Add the package name into tagFormat.
	// Thought about doing a single release for the tag (merging several packages), but it's impossible to prevent Github releasing while allowing NPM to continue.
	// It'd also be difficult to merge all the assets into one release without full editing/overriding the plugins.
	const tagFormatCtx = {
		name,
		version: "${version}",
	};

	const tagFormatDefault = "${name}@${version}";
	options.tagFormat = template(flags.tagFormat || tagFormatDefault)(tagFormatCtx);

	// These are the only two options that MSR shares with semrel
	// Set them manually for now, defaulting to the msr versions
	// This is approach can be reviewed if there's ever more crossover.
	// - debug is only supported in semrel as a CLI arg, always default to MSR
	options.debug = flags.debug;
	// - dryRun should use the msr version if specified, otherwise fallback to semrel
	options.dryRun = flags.dryRun === undefined ? options.dryRun : flags.dryRun;

	// This options are needed for plugins that do not rely on `pluginOptions` and extract them independently.
	options._pkgOptions = pkgOptions;

	// Call semanticRelease() on the directory and save result to pkg.
	// Don't need to log out errors as semantic-release already does that.
	pkg.result = await semanticRelease(options, {
		cwd: dir,
		env,
		stdout: new RescopedStream(stdout, name),
		stderr: new RescopedStream(stderr, name),
	});

	return pkg;
}

function normalizeFlags(_flags) {
	return {
		deps: {},
		..._flags,
	};
}

// Exports.
export default multiSemanticRelease;
