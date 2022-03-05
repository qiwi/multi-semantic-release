#!/usr/bin/env node

import meow from "meow";
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
    --ignore-packages  Packages' list to be ignored on bumping process
    --tag-format Format to use for creating tag names. Should include "name" and "version" vars. Default: "\${name}@\${version}" generates "package-name@1.0.0"
    --help Help info.

  Examples
    $ multi-semantic-release --debug
    $ multi-semantic-release --deps.bump=satisfy --deps.release=patch
    $ multi-semantic-release --ignore-packages=packages/a/**,packages/b/**
`,
	{
		flags: {
			sequentialInit: {
				type: "boolean",
			},
			sequentialPrepare: {
				type: "boolean",
				default: true,
			},
			firstParent: {
				type: "boolean",
			},
			debug: {
				type: "boolean",
			},
			"deps.bump": {
				type: "string",
				default: "override",
			},
			"deps.release": {
				type: "string",
				default: "patch",
			},
			ignorePackages: {
				type: "string",
			},
			tagFormat: {
				type: "string",
				default: "${name}@${version}",
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
