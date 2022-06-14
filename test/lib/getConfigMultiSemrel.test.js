import getConfig from "../../lib/getConfigMultiSemrel.js";
import { gitInit } from "../helpers/git.js";
import { copyDirectory } from "../helpers/file.js";

// Tests.
describe("getConfig()", () => {
	test("Default options", async () => {
		const result = await getConfig(process.cwd(), {});
		expect(result).toMatchObject({
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
			},
		});
	});

	test("Only CLI flags and default options", async () => {
		const cliFlags = {
			debug: true,
			dryRun: false,
			ignorePackages: ["!packages/d/**"],
			deps: {
				bump: "inherit",
			},
		};
		const result = await getConfig(process.cwd(), cliFlags);
		expect(result).toMatchObject({
			sequentialInit: false,
			sequentialPrepare: true,
			firstParent: false,
			debug: true,
			ignorePrivate: true,
			ignorePackages: ["!packages/d/**"],
			tagFormat: "${name}@${version}",
			dryRun: false,
			deps: {
				bump: "inherit",
				release: "patch",
				prefix: "",
			},
		});
	});

	test("package.json config", async () => {
		const cwd = await gitInit();
		copyDirectory(`test/fixtures/yarnWorkspacesConfig/`, cwd);
		const result = await getConfig(cwd, {});
		expect(result).toMatchObject({
			sequentialInit: false,
			sequentialPrepare: true,
			firstParent: false,
			debug: true,
			ignorePrivate: true,
			ignorePackages: ["!packages/d/**"],
			tagFormat: "${name}@${version}",
			dryRun: undefined,
			deps: {
				bump: "inherit",
				release: "patch",
				prefix: "",
			},
		});
	});

	test("package.json config and CLI flags", async () => {
		const cwd = await gitInit();
		const cliFlags = {
			debug: false,
			ignorePackages: ["!packages/c/**"],
			deps: {
				release: "minor",
			},
		};
		copyDirectory(`test/fixtures/yarnWorkspacesConfig/`, cwd);
		const result = await getConfig(cwd, cliFlags);
		expect(result).toMatchObject({
			sequentialInit: false,
			sequentialPrepare: true,
			firstParent: false,
			debug: false,
			ignorePrivate: true,
			ignorePackages: ["!packages/d/**", "!packages/c/**"],
			tagFormat: "${name}@${version}",
			dryRun: undefined,
			deps: {
				bump: "inherit",
				release: "minor",
				prefix: "",
			},
		});
	});

	test("package.json extends", async () => {
		const cwd = await gitInit();
		copyDirectory(`test/fixtures/yarnWorkspacesConfigExtends/`, cwd);
		const result = await getConfig(cwd, {});
		expect(result).toMatchObject({
			sequentialInit: false,
			sequentialPrepare: true,
			firstParent: false,
			debug: true,
			ignorePrivate: true,
			ignorePackages: ["!packages/d/**"],
			tagFormat: "${name}@${version}",
			dryRun: undefined,
			deps: {
				bump: "satisfy",
				release: "patch",
				prefix: "",
			},
		});
	});

	test("package.json extends and CLI flags", async () => {
		const cwd = await gitInit();
		const cliFlags = {
			debug: false,
			ignorePackages: ["!packages/c/**"],
			deps: {
				release: "minor",
			},
		};
		copyDirectory(`test/fixtures/yarnWorkspacesConfigExtends/`, cwd);
		const result = await getConfig(cwd, cliFlags);
		expect(result).toMatchObject({
			sequentialInit: false,
			sequentialPrepare: true,
			firstParent: false,
			debug: false,
			ignorePrivate: true,
			ignorePackages: ["!packages/d/**", "!packages/c/**"],
			tagFormat: "${name}@${version}",
			dryRun: undefined,
			deps: {
				bump: "satisfy",
				release: "minor",
				prefix: "",
			},
		});
	});
});
