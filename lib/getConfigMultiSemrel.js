import resolveFrom from "resolve-from";
import { cosmiconfig } from "cosmiconfig";
import { pickBy, isNil, castArray, uniq } from "lodash-es";
import { createRequire } from "node:module";

/**
 * @typedef {Object} DepsConfig
 * @property {'override' | 'satisfy' | 'inherit'} bump
 * @property {'patch' | 'minor' | 'major' | 'inherit'} release
 * @property {'^' | '~' | ''} prefix
 * @property {boolean} useTagsForBump
 */

/**
 * @typedef {Object} MultiReleaseConfig
 * @property {boolean} sequentialInit
 * @property {boolean} sequentialPrepare
 * @property {boolean}	firstParent
 * @property {boolean}	debug
 * @property {boolean}	ignorePrivate
 * @property {Array<string>} ignorePackages
 * @property {string}	tagFormat
 * @property {boolean}	dryRun
 * @property {DepsConfig} deps
 * @property {boolean}	silent
 */

const CONFIG_NAME = "multi-release";
const CONFIG_FILES = [
	"package.json",
	`.${CONFIG_NAME}rc`,
	`.${CONFIG_NAME}rc.json`,
	`.${CONFIG_NAME}rc.yaml`,
	`.${CONFIG_NAME}rc.yml`,
	`.${CONFIG_NAME}rc.js`,
	`.${CONFIG_NAME}rc.cjs`,
	`${CONFIG_NAME}.config.js`,
	`${CONFIG_NAME}.config.cjs`,
];

const mergeConfig = (a = {}, b = {}) => {
	return {
		...a,
		// Remove `null` and `undefined` options so they can be replaced with default ones
		...pickBy(b, (option) => !isNil(option)),
		// Treat nested objects differently as otherwise we'll loose undefined keys
		deps: {
			...a.deps,
			...pickBy(b.deps, (option) => !isNil(option)),
		},
		// Treat arrays differently by merging them
		ignorePackages: uniq([...castArray(a.ignorePackages || []), ...castArray(b.ignorePackages || [])]),
	};
};

/**
 * Get the multi semantic release configuration options for a given directory.
 *
 * @param {string} cwd The directory to search.
 * @param {Object} cliOptions cli supplied options.
 * @returns {MultiReleaseConfig} The found configuration option
 *
 * @internal
 */
export default async function getConfig(cwd, cliOptions) {
	const { config } = (await cosmiconfig(CONFIG_NAME, { searchPlaces: CONFIG_FILES }).search(cwd)) || {};
	const { extends: extendPaths, ...rest } = { ...config };

	let options = rest;

	if (extendPaths) {
		const require = createRequire(import.meta.url);
		// If `extends` is defined, load and merge each shareable config
		const extendedOptions = castArray(extendPaths).reduce((result, extendPath) => {
			const extendsOptions = require(resolveFrom(cwd, extendPath));
			return mergeConfig(result, extendsOptions);
		}, {});

		options = mergeConfig(options, extendedOptions);
	}

	// Set default options values if not defined yet
	options = mergeConfig(
		{
			sequentialInit: false,
			sequentialPrepare: true,
			firstParent: false,
			debug: false,
			ignorePrivate: true,
			ignorePackages: [],
			tagFormat: "${name}@${version}",
			dryRun: undefined,
			deps: {
				bump: "override",
				release: "patch",
				prefix: "",
				useTagsForBump: false,
			},
			silent: false,
		},
		options
	);

	// Finally merge CLI options last so they always win
	return mergeConfig(options, cliOptions);
}
