const { resolveReleaseType } = require("../../lib/updateDeps");

// Tests.
describe("resolveReleaseType()", () => {
	test("Works correctly with no deps", () => {
		expect(resolveReleaseType({ _localDeps: [] })).toBe(undefined);
	});
	test("Works correctly with deps", () => {
		const pkg1 = { _nextType: "patch", _localDeps: [] };
		expect(resolveReleaseType(pkg1)).toBe("patch");
		const pkg2 = { _nextType: undefined, _localDeps: [] };
		expect(resolveReleaseType(pkg2)).toBe(undefined);
		const pkg3 = {
			_nextType: undefined,
			_localDeps: [
				{ _nextType: false, _localDeps: [] },
				{ _nextType: false, _localDeps: [] },
			],
		};
		expect(resolveReleaseType(pkg3)).toBe(undefined);
		const pkg4 = {
			manifest: { dependencies: { a: "1.0.0" } },
			_nextType: undefined,
			_localDeps: [
				{ name: "a", _nextType: "patch", _localDeps: [], _lastRelease: { version: "1.0.0" } },
				{ name: "b", _nextType: false, _localDeps: [], _lastRelease: { version: "1.0.0" } },
			],
		};
		expect(resolveReleaseType(pkg4)).toBe("patch");
		const pkg5 = {
			_nextType: undefined,
			_localDeps: [
				{
					_nextType: false,
					_localDeps: [
						{ _nextType: false, _localDeps: [] },
						{ _nextType: false, _localDeps: [] },
					],
				},
			],
		};
		expect(resolveReleaseType(pkg5)).toBe(undefined);
		const pkg6 = {
			manifest: { dependencies: { a: "1.0.0" } },
			_nextType: undefined,
			_localDeps: [
				{
					name: "a",
					_lastRelease: { version: "1.0.0" },
					_nextType: false,
					manifest: { dependencies: { b: "1.0.0", c: "1.0.0", d: "1.0.0" } },
					_localDeps: [
						{ name: "b", _nextType: false, _localDeps: [], _lastRelease: { version: "1.0.0" } },
						{ name: "c", _nextType: "patch", _localDeps: [], _lastRelease: { version: "1.0.0" } },
						{ name: "d", _nextType: "major", _localDeps: [], _lastRelease: { version: "1.0.0" } },
					],
				},
			],
		};
		expect(resolveReleaseType(pkg6, "override", "inherit")).toBe("major");
	});
	test("No infinite loops", () => {
		const pkg1 = { _nextType: "patch", _localDeps: [] };
		pkg1._localDeps.push(pkg1);
		expect(resolveReleaseType(pkg1)).toBe("patch");
		const pkg2 = { _nextType: undefined, _localDeps: [] };
		pkg2._localDeps.push(pkg2);
		expect(resolveReleaseType(pkg2)).toBe(undefined);
		const pkg3 = {
			_nextType: undefined,
			_localDeps: [
				{ _nextType: false, _localDeps: [] },
				{ _nextType: false, _localDeps: [] },
			],
		};
		pkg3._localDeps[0]._localDeps.push(pkg3._localDeps[0]);
		expect(resolveReleaseType(pkg3)).toBe(undefined);
		const pkg4 = {
			manifest: { dependencies: { a: "1.0.0", b: "1.0.0" } },
			_nextType: undefined,
			_localDeps: [
				{ name: "a", _nextType: "patch", _localDeps: [], _lastRelease: { version: "1.0.0" } },
				{ name: "b", _nextType: "major", _localDeps: [], _lastRelease: { version: "1.0.0" } },
			],
		};
		pkg4._localDeps[0]._localDeps.push(pkg4._localDeps[0]);
		expect(resolveReleaseType(pkg4)).toBe("patch");
	});
});
