import { resolve } from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { topo } from "@semrel-extra/topo";

const __dirname = dirname(fileURLToPath(import.meta.url));
const getPackagePaths = async (cwd, ignore = []) => {
	const workspacesExtra = ignore.map((item) => `!${item}`);
	const result = await topo({ cwd, workspacesExtra });
	return Object.values(result.packages)
		.map((pkg) => pkg.manifestPath)
		.sort();
};

// Tests.
describe("getPackagePaths()", () => {
	test("yarn: Works correctly with workspaces", async () => {
		const resolved = resolve(`${__dirname}/../fixtures/yarnWorkspaces`);
		expect(await getPackagePaths(resolved)).toEqual([
			`${resolved}/packages/a/package.json`,
			`${resolved}/packages/b/package.json`,
			`${resolved}/packages/c/package.json`,
			`${resolved}/packages/d/package.json`,
		]);
	});
	test("yarn: Should ignore some packages", async () => {
		const resolved = resolve(`${__dirname}/../fixtures/yarnWorkspacesIgnore`);
		expect(await getPackagePaths(resolved)).toEqual([
			`${resolved}/packages/a/package.json`,
			`${resolved}/packages/b/package.json`,
			`${resolved}/packages/c/package.json`,
		]);

		const resolvedSplit = resolve(`${__dirname}/../fixtures/yarnWorkspacesIgnoreSplit`);
		expect(await getPackagePaths(resolvedSplit)).toEqual([
			`${resolvedSplit}/packages/a/package.json`,
			`${resolvedSplit}/packages/c/package.json`,
		]);
	});
	test("yarn: Should ignore some packages via CLI", async () => {
		const resolved = resolve(`${__dirname}/../fixtures/yarnWorkspacesIgnore`);
		expect(await getPackagePaths(resolved, ["packages/a/**", "packages/b/**"])).toEqual([
			`${resolved}/packages/c/package.json`,
		]);

		const resolvedSplit = resolve(`${__dirname}/../fixtures/yarnWorkspacesIgnoreSplit`);
		expect(await getPackagePaths(resolvedSplit, ["packages/b", "packages/d"])).toEqual([
			`${resolvedSplit}/packages/a/package.json`,
			`${resolvedSplit}/packages/c/package.json`,
		]);
	});
	// test("yarn: Should throw when ignored packages from CLI and workspaces sets an empty workspace list to be processed", async () => {
	// 	const resolved = resolve(`${__dirname}/../fixtures/yarnWorkspacesIgnore`);
	// 	expect(() => await getPackagePaths(resolved, ["packages/a/**", "packages/b/**", "packages/c/**"])).toThrow(TypeError);
	// 	expect(() => await getPackagePaths(resolved, ["packages/a/**", "packages/b/**", "packages/c/**"])).toThrow(
	// 		"package.json: Project must contain one or more workspace-packages"
	// 	);
	// });
	// test("yarn: Error if no workspaces setting", async () => {
	// 	const resolved = resolve(`${__dirname}/../fixtures/emptyYarnWorkspaces`);
	// 	expect(() => await getPackagePaths(resolved)).toThrow(Error);
	// 	expect(() => await getPackagePaths(resolved)).toThrow("contain one or more workspace-packages");
	// });
	test("yarn: Works correctly with workspaces.packages", async () => {
		const resolved = resolve(`${__dirname}/../fixtures/yarnWorkspacesPackages`);
		expect(await getPackagePaths(resolved)).toEqual([
			`${resolved}/packages/a/package.json`,
			`${resolved}/packages/b/package.json`,
			`${resolved}/packages/c/package.json`,
			`${resolved}/packages/d/package.json`,
		]);
	});
	test("pnpm: Works correctly with workspace", async () => {
		const resolved = resolve(`${__dirname}/../fixtures/pnpmWorkspace`);
		expect(await getPackagePaths(resolved)).toEqual([
			`${resolved}/packages/a/package.json`,
			`${resolved}/packages/b/package.json`,
			`${resolved}/packages/c/package.json`,
			`${resolved}/packages/d/package.json`,
		]);
	});
	// test("pnpm: Error if no workspaces setting", async () => {
	// 	const resolved = resolve(`${__dirname}/../fixtures/pnpmWorkspaceUndefined`);
	// 	expect(() => await getPackagePaths(resolved)).toThrow(Error);
	// 	expect(() => await getPackagePaths(resolved)).toThrow("contain one or more workspace-packages");
	// });
	test("pnpm: Should ignore some packages", async () => {
		const resolved = resolve(`${__dirname}/../fixtures/pnpmWorkspaceIgnore`);
		expect(await getPackagePaths(resolved)).toEqual([
			`${resolved}/packages/a/package.json`,
			`${resolved}/packages/b/package.json`,
			`${resolved}/packages/c/package.json`,
		]);
	});
	test("pnpm: Should ignore some packages via CLI", async () => {
		const resolved = resolve(`${__dirname}/../fixtures/pnpmWorkspaceIgnore`);
		expect(await getPackagePaths(resolved, ["packages/a/**", "packages/b/**"])).toEqual([
			`${resolved}/packages/c/package.json`,
		]);
	});
	test("bolt: Works correctly with workspaces", async () => {
		const resolved = resolve(`${__dirname}/../fixtures/boltWorkspaces`);
		expect(await getPackagePaths(resolved)).toEqual([
			`${resolved}/packages/a/package.json`,
			`${resolved}/packages/b/package.json`,
			`${resolved}/packages/c/package.json`,
			`${resolved}/packages/d/package.json`,
		]);
	});
	// test("bolt: Error if no workspaces setting", async () => {
	// 	const resolved = resolve(`${__dirname}/../fixtures/boltWorkspacesUndefined`);
	// 	expect(() => await getPackagePaths(resolved)).toThrow(Error);
	// 	expect(() => await getPackagePaths(resolved)).toThrow("contain one or more workspace-packages");
	// });
	test("bolt: Should ignore some packages", async () => {
		const resolved = resolve(`${__dirname}/../fixtures/boltWorkspacesIgnore`);
		expect(await getPackagePaths(resolved)).toEqual([
			`${resolved}/packages/a/package.json`,
			`${resolved}/packages/b/package.json`,
			`${resolved}/packages/c/package.json`,
		]);
	});
	test("bolt: Should ignore some packages via CLI", async () => {
		const resolved = resolve(`${__dirname}/../fixtures/boltWorkspacesIgnore`);
		expect(await getPackagePaths(resolved, ["packages/a/**", "packages/b/**"])).toEqual([
			`${resolved}/packages/c/package.json`,
		]);
	});
});
