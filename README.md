# @qiwi/multi-semantic-release
hacky [semantic-release](https://github.com/semantic-release/semantic-release) for monorepos

[![Travis CI](https://travis-ci.com/qiwi/multi-semantic-release.svg?branch=master)](https://travis-ci.com/qiwi/multi-semantic-release)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat)](https://github.com/semantic-release/semantic-release)
[![Maintainability](https://api.codeclimate.com/v1/badges/c6ee027803a794f1d67d/maintainability)](https://codeclimate.com/github/qiwi/multi-semantic-release/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/c6ee027803a794f1d67d/test_coverage)](https://codeclimate.com/github/qiwi/multi-semantic-release/test_coverage)

This fork of [dhoub/multi-semantic-release](https://github.com/dhoulb/multi-semantic-release) replaces [`setImmediate` loops](https://github.com/dhoulb/multi-semantic-release/blob/561a8e66133d422d88008c32c479d1148876aba4/lib/wait.js#L13)
and [`execa.sync` hooks](https://github.com/dhoulb/multi-semantic-release/blob/561a8e66133d422d88008c32c479d1148876aba4/lib/execaHook.js#L5) with event-driven flow and finally makes possible to run the most release operations in parallel.  
🎉 🎉 🎉

## Install

```sh
yarn add @qiwi/multi-semantic-release --dev
```

## Usage

```sh
multi-semantic-release
```

## Configuring Multi-Semantic-Release

multi-semantic-release can be configured a number of ways:

* A `.multi-releaserc` file, written in YAML or JSON, with optional extensions: `.yaml`/ `.yml`/ `.json`/ `.js`
* A `multi-release.config.js` file that exports an object
* A `multi-release` key in the workspace root package.json

Alternatively some options may be set via CLI flags.

**Note:** CLI arguments take precedence over options configured in the configuration file.

### Options

| Option | Type | CLI Flag | Description |
| ------ | ---- | -------- | ----------- |
| dryRun | `boolean` | `--dry-run` | Dry run mode. |
| debug | `boolean` | `--debug` | Output debugging information. |
| extends | `String \| Array` | N/A | List of modules or file paths containing a shareable configuration. If multiple shareable configurations are set, they will be imported in the order defined with each configuration option taking precedence over the options defined in the previous. |
| sequentialInit | `boolean` | `--sequential-init` | Avoid hypothetical concurrent initialization collisions. |
| sequentialPrepare | `boolean` | `--sequential-prepare` | Avoid hypothetical concurrent preparation collisions. **True by default.** |
| firstParent | `boolean` | `--first-parent` | Apply commit filtering to current branch only. |
| ignorePrivate | `boolean` | `--ignore-private` | Exclude private packages. **True by default.** |
| ignorePackages | `String \| Array` | `--ignore-packages` | Packages list to be ignored on bumping process (appended to the ones that already exist at package.json workspaces). If using the CLI flag, supply a comma seperated list of strings. |
| tagFormat | `String` | `--tag-format` | Format to use when creating tag names. Should include "name" and "version" vars. Default: `"${name}@${version}"` which generates "package-name@1.0.0" |
| deps | `Object` | N/A | Depedency handling, see below for possible values. |

### `deps` Options

| Option | Type | CLI Flag | Description |
| ------ | ---- | -------- | ----------- |
| bump | `override \| satisfy \| inherit` | `--deps.bump` | Define deps version updating rule. Allowed: override, satisfy, inherit. **`override` by default.** |
| release | `patch \| minor \| major \| inherit` | `--deps.release` | Define release type for dependent package if any of its deps changes. Supported values: patch, minor, major, inherit. **`patch` by default** |
| prefix | `'^' \| '~' \| ''` | `--deps.prefix` | Optional prefix to be attached to the next version if `bump` is set to `override`. **`''` by default**. |

### Examples

* Via multi-release key in the project's package.json file:

```json
{
	"multi-release": {
		"ignorePackages": [
			"!packages/b/**",
			"!packages/c/**"
		],
		"deps": {
			"bump": "inherit"
		}
	}
}
```

* Via `.multi-releaserc` file:

```json
{
	"ignorePackages": [
		"!packages/b/**",
		"!packages/c/**"
	],
	"deps": {
		"bump": "inherit"
	}
}
```

* Via CLI:

```sh
$ multi-semantic-release --ignore-packages=packages/a/**,packages/b/** --deps.bump=inherit
```

## Configuring Semantic-Release
**MSR** requires **semrel** config to be added [in any supported format](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration) for each package or/and declared in repo root (`globalConfig` is extremely useful if all the modules have the same strategy of release).  
NOTE config resolver joins `globalConfig` and `packageConfig` during execution.
```javascript
// Load the package-specific options.
const { options: pkgOptions } = await getConfig(dir);

// The 'final options' are the global options merged with package-specific options.
// We merge this ourselves because package-specific options can override global options.
const finalOptions = Object.assign({}, globalOptions, pkgOptions);
```

Make sure to have a `workspaces` attribute inside your `package.json` project file. In there, you can set a list of packages that you might want to process in the msr process, as well as ignore others. For example, let's say your project has 4 packages (i.e. a, b, c and d) and you want to process only a and d (ignore b and c). You can set the following structure in your `package.json` file:

```json
{
	"name": "msr-test-yarn",
	"author": "Dave Houlbrooke <dave@shax.com",
	"version": "0.0.0-semantically-released",
	"private": true,
	"license": "0BSD",
	"engines": {
		"node": ">=8.3"
	},
	"workspaces": [
      "packages/*",
      "!packages/b/**",
      "!packages/c/**"
	],
	"release": {
		"plugins": [
			"@semantic-release/commit-analyzer",
			"@semantic-release/release-notes-generator"
		],
		"noCi": true
	}
}
```

You can also ignore it with the CLI:

```bash
$ multi-semantic-release --ignore-packages=packages/b/**,packages/c/**
```

You can also combine the CLI ignore options with the `!` operator at each package inside `workspaces` attribute. Even though you can use the CLI to ignore options, you can't use it to set which packages to be released – i.e. you still need to set the `workspaces` attribute inside the `package.json`.

## Verified examples
We use this tool to release our JS platform code inhouse (GitHub Enterprise + JB TeamCity) and for our OSS (GitHub + Travis CI). Guaranteed working configurations available in projects.
* [qiwi/substrate](https://github.com/qiwi/substrate)
* [qiwi/json-rpc](https://github.com/qiwi/json-rpc)
* [qiwi/lint-config-qiwi](https://github.com/qiwi/lint-config-qiwi)
