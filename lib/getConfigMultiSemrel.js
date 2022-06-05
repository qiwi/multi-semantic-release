import { cosmiconfig } from "cosmiconfig";
import { default as resolveFrom } from "resolve-from";
import { pickBy, isNil, castArray } from "lodash-es";

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

/**
 * Get the multi semantic release configuration options for a given directory.
 *
 * @param {string} cwd The directory to search.
 * @param {Object} cliOptions cli supplied options.
 * @returns {Object} The found configuration option
 *
 * @internal
 */
export default async function getConfig(cwd, cliOptions) {
	const { config } = (await cosmiconfig(CONFIG_NAME, { searchPlaces: CONFIG_FILES }).search(cwd)) || {};
	const { extends: extendPaths, ...rest } = { ...config, ...cliOptions };

	let options = rest;

	if (extendPaths) {
		// If `extends` is defined, load and merge each shareable config with `options`
		options = {
			...castArray(extendPaths).reduce((result, extendPath) => {
				const extendsOptions = require(resolveFrom.silent(__dirname, extendPath) ||
					resolveFrom(cwd, extendPath));
				return { ...result, ...extendsOptions };
			}, {}),
			...options,
		};
	}

	// Set default options values if not defined yet
	options = {
		sequentialInit: false,
		sequentialPrepare: true,
		firstParent: false,
		debug: false,
		ignorePrivate: true,
		ignorePackages: "",
		tagFormat: "${name}@${version}",
		dryRun: false,
		// Remove `null` and `undefined` options so they can be replaced with default ones
		...pickBy(options, (option) => !isNil(option)),
		// Treat nested objects differently as otherwise we'll loose undefined keys
		deps: {
			bump: "override",
			release: "patch",
			prefix: "",
			...pickBy(options.deps, (option) => !isNil(option)),
		},
	};

	return options;
}
