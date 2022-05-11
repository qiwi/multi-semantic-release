import dbg from "debug";
import getCommitsFiltered from "./getCommitsFiltered.js";
import { updateManifestDeps, resolveReleaseType } from "./updateDeps.js";

const debug = dbg("msr:inlinePlugin");

/**
 * Create an inline plugin creator for a multirelease.
 * This is caused once per multirelease and returns a function which should be called once per package within the release.
 *
 * @param {Package[]} packages The multi-semantic-release context.
 * @param {MultiContext} multiContext The multi-semantic-release context.
 * @param {Object} flags argv options
 * @returns {Function} A function that creates an inline package.
 *
 * @internal
 */
function createInlinePluginCreator(packages, multiContext, flags) {
	// Vars.
	const { cwd } = multiContext;

	/**
	 * Create an inline plugin for an individual package in a multirelease.
	 * This is called once per package and returns the inline plugin used for semanticRelease()
	 *
	 * @param {Package} pkg The package this function is being called on.
	 * @returns {Object} A semantic-release inline plugin containing plugin step functions.
	 *
	 * @internal
	 */
	function createInlinePlugin(pkg) {
		// Vars.
		const { plugins, dir, name } = pkg;
		const debugPrefix = `[${name}]`;

		/**
		 * @var {Commit[]} List of _filtered_ commits that only apply to this package.
		 */
		let commits;

		/**
		 * @param {object} pluginOptions Options to configure this plugin.
		 * @param {object} context The semantic-release context.
		 * @returns {Promise<void>} void
		 * @internal
		 */
		const verifyConditions = async (pluginOptions, context) => {
			// Restore context for plugins that does not rely on parsed opts.
			Object.assign(context.options, context.options._pkgOptions);

			// And bind the actual logger.
			Object.assign(pkg.loggerRef, context.logger);

			const res = await plugins.verifyConditions(context);
			pkg._ready = true;

			debug(debugPrefix, "verified conditions");

			return res;
		};

		/**
		 * Analyze commits step.
		 * Responsible for determining the type of the next release (major, minor or patch). If multiple plugins with a analyzeCommits step are defined, the release type will be the highest one among plugins output.
		 *
		 * In multirelease: Returns "patch" if the package contains references to other local packages that have changed, or null if this package references no local packages or they have not changed.
		 * Also updates the `context.commits` setting with one returned from `getCommitsFiltered()` (which is filtered by package directory).
		 *
		 * @param {object} pluginOptions Options to configure this plugin.
		 * @param {object} context The semantic-release context.
		 * @returns {Promise<void>} Promise that resolves when done.
		 *
		 * @internal
		 */
		const analyzeCommits = async (pluginOptions, context) => {
			const firstParentBranch = flags.firstParent ? context.branch.name : undefined;
			pkg._preRelease = context.branch.prerelease || null;
			pkg._branch = context.branch.name;

			// Filter commits by directory.
			commits = await getCommitsFiltered(cwd, dir, context.lastRelease.gitHead, firstParentBranch);

			// Set context.commits so analyzeCommits does correct analysis.
			context.commits = commits;

			// Set lastRelease for package from context.
			pkg._lastRelease = context.lastRelease;

			// Set nextType for package from plugins.
			pkg._nextType = await plugins.analyzeCommits(context);

			pkg._analyzed = true;

			// Make sure type is "patch" if the package has any deps that have been changed.
			pkg._nextType = resolveReleaseType(pkg, flags.deps.bump, flags.deps.release, [], flags.deps.prefix);

			debug(debugPrefix, "commits analyzed");
			debug(debugPrefix, `release type: ${pkg._nextType}`);

			// Return type.
			return pkg._nextType;
		};

		/**
		 * Generate notes step (after).
		 * Responsible for generating the content of the release note. If multiple plugins with a generateNotes step are defined, the release notes will be the result of the concatenation of each plugin output.
		 *
		 * In multirelease: Edit the H2 to insert the package name and add an upgrades section to the note.
		 * We want this at the _end_ of the release note which is why it's stored in steps-after.
		 *
		 * Should look like:
		 *
		 *     ## my-amazing-package [9.2.1](github.com/etc) 2018-12-01
		 *
		 *     ### Features
		 *
		 *     * etc
		 *
		 *     ### Dependencies
		 *
		 *     * **my-amazing-plugin:** upgraded to 1.2.3
		 *     * **my-other-plugin:** upgraded to 4.9.6
		 *
		 * @param {object} pluginOptions Options to configure this plugin.
		 * @param {object} context The semantic-release context.
		 * @returns {Promise<void>} Promise that resolves to the string
		 *
		 * @internal
		 */
		const generateNotes = async (pluginOptions, context) => {
			// Set nextRelease for package.
			pkg._nextRelease = context.nextRelease;

			// Wait until all todo packages are ready to generate notes.
			// await waitForAll("_nextRelease", (p) => p._nextType);

			// Vars.
			const notes = [];

			// Set context.commits so analyzeCommits does correct analysis.
			// We need to redo this because context is a different instance each time.
			context.commits = commits;

			// Get subnotes and add to list.
			// Inject pkg name into title if it matches e.g. `# 1.0.0` or `## [1.0.1]` (as generate-release-notes does).
			const subs = await plugins.generateNotes(context);
			// istanbul ignore else (unnecessary to test)
			if (subs) notes.push(subs.replace(/^(#+) (\[?\d+\.\d+\.\d+\]?)/, `$1 ${name} $2`));

			// If it has upgrades add an upgrades section.
			const upgrades = pkg.localDeps.filter((d) => d._nextRelease);
			if (upgrades.length) {
				notes.push(`### Dependencies`);
				const bullets = upgrades.map((d) => `* **${d.name}:** upgraded to ${d._nextRelease.version}`);
				notes.push(bullets.join("\n"));
			}

			debug(debugPrefix, "notes generated");

			// Return the notes.
			return notes.join("\n\n");
		};

		const prepare = async (pluginOptions, context) => {
			updateManifestDeps(pkg);
			pkg._depsUpdated = true;

			// Set context.commits so analyzeCommits does correct analysis.
			// We need to redo this because context is a different instance each time.
			context.commits = commits;

			const res = await plugins.prepare(context);
			pkg._prepared = true;

			debug(debugPrefix, "prepared");

			return res;
		};

		const publish = async (pluginOptions, context) => {
			const res = await plugins.publish(context);
			pkg._published = true;
			debug(debugPrefix, "published");

			// istanbul ignore next
			return res.length ? res[0] : {};
		};

		const inlinePlugin = {
			verifyConditions,
			analyzeCommits,
			generateNotes,
			prepare,
			publish,
		};

		// Add labels for logs.
		Object.keys(inlinePlugin).forEach((type) =>
			Reflect.defineProperty(inlinePlugin[type], "pluginName", {
				value: "Inline plugin",
				writable: false,
				enumerable: true,
			})
		);

		debug(debugPrefix, "inlinePlugin created");

		return inlinePlugin;
	}

	// Return creator function.
	return createInlinePlugin;
}

// Exports.
export default createInlinePluginCreator;
