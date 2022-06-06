#!/usr/bin/env node

import meow from "meow";
import process from "process";
import { toPairs, set } from "lodash-es";
import runner from "./runner.js";

const cli = meow(
	`
  Usage
    $ multi-semantic-release

  Options
    --dry-run Dry run mode.
    --debug Output debugging information.
    --sequential-init  Avoid hypothetical concurrent initialization collisions.
    --sequential-prepare  Avoid hypothetical concurrent preparation collisions. Do not use if your project have cyclic dependencies.
    --first-parent Apply commit filtering to current branch only.
    --deps.bump Define deps version updating rule. Allowed: override, satisfy, inherit.
    --deps.release Define release type for dependent package if any of its deps changes. Supported values: patch, minor, major, inherit.
    --deps.prefix Optional prefix to be attached to the next dep version if '--deps.bump' set to 'override'. Supported values: '^' | '~' | '' (empty string as default).
    --ignore-packages  Packages list to be ignored on bumping process
    --ignore-private Exclude private packages. Enabled by default, pass 'no-ignore-private' to disable.
    --tag-format Format to use for creating tag names. Should include "name" and "version" vars. Default: "\${name}@\${version}" generates "package-name@1.0.0"
    --help Help info.

  Examples
    $ multi-semantic-release --debug
    $ multi-semantic-release --deps.bump=satisfy --deps.release=patch
    $ multi-semantic-release --ignore-packages=packages/a/**,packages/b/**
`,
	{
		importMeta: import.meta,
		get argv() {
			const argvStart = process.argv.includes("--") ? process.argv.indexOf("--") + 1 : 2;
			return process.argv.slice(argvStart);
		},
		booleanDefault: undefined,
		flags: {
			sequentialInit: {
				type: "boolean",
			},
			sequentialPrepare: {
				type: "boolean",
			},
			firstParent: {
				type: "boolean",
			},
			debug: {
				type: "boolean",
			},
			"deps.bump": {
				type: "string",
			},
			"deps.release": {
				type: "string",
			},
			"deps.prefix": {
				type: "string",
			},
			ignorePrivate: {
				type: "boolean",
			},
			ignorePackages: {
				type: "string",
			},
			tagFormat: {
				type: "string",
			},
			dryRun: {
				type: "boolean",
			},
		},
	}
);

const processFlags = (flags) => {
	return toPairs(flags).reduce((m, [k, v]) => {
		if (k === "ignorePackages" && v) {
			return set(m, k, v.split(","));
		}

		// FIXME Smth wrong with negate parser.
		if (flags[`no${k[0].toUpperCase()}${k.slice(1)}`]) {
			flags[k] = false;
			return set(m, k, false);
		}

		return set(m, k, v);
	}, {});
};

runner(processFlags(cli.flags));
