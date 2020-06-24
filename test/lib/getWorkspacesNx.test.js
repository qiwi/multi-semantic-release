const { resolve } = require("path");
const getWorkspacesNx = require("../../lib/getWorkspacesNx");

// Tests.
describe("getWorkspacesNx()", () => {
	test("Works correctly with workspaces", () => {
		const resolved = resolve(`${__dirname}/../fixtures/nxWorkspaces`);
		expect(getWorkspacesNx(resolved)).toEqual([
			`${resolved}/apps/c/package.json`,
			`${resolved}/apps/d/package.json`,
			`${resolved}/libs/a/package.json`,
			`${resolved}/libs/b/package.json`,
		]);
	});
	// test("TypeError if bad workspaces setting", () => {
	// 	const resolved = resolve(`${__dirname}/../fixtures/badnxWorkspaces`);
	// 	expect(() => getWorkspacesNx(resolved)).toThrow(TypeError);
	// 	expect(() => getWorkspacesNx(resolved)).toThrow("non-empty array of string");
	// });
	// test("TypeError if no workspaces setting", () => {
	// 	const resolved = resolve(`${__dirname}/../fixtures/undefinednxWorkspaces`);
	// 	expect(() => getWorkspacesNx(resolved)).toThrow(TypeError);
	// 	expect(() => getWorkspacesNx(resolved)).toThrow("non-empty array of string");
	// });
	// test("Error if no workspaces setting", () => {
	// 	const resolved = resolve(`${__dirname}/../fixtures/emptynxWorkspaces`);
	// 	expect(() => getWorkspacesNx(resolved)).toThrow(Error);
	// 	expect(() => getWorkspacesNx(resolved)).toThrow("contain one or more workspaces");
	// });
});
