const { resolveReleaseType, resolveNextVersion } = require("../../lib/updateDeps");

describe("resolveNextVersion()", () => {
	// prettier-ignore
	const cases = [
		["1.0.0", "1.0.1", undefined, "1.0.1"],
		["1.0.0", "1.0.1", "override", "1.0.1"],

		["*", "1.3.0", "satisfy", "*"],
		["^1.0.0", "1.0.1", "satisfy", "^1.0.0"],
		["^1.2.0", "1.3.0", "satisfy", "^1.2.0"],
		["1.2.x", "1.2.2", "satisfy", "1.2.x"],

		["1.2.x", "1.3.0", "inherit", "1.3.x"],
		["^1.0.0", "2.0.0", "inherit", "^2.0.0"],
		["*", "2.0.0", "inherit", "*"],
		["~1.0", "2.0.0", "inherit", "~2.0"],
		["~2.0", "2.1.0", "inherit", "~2.1"],
	]

	cases.forEach(([currentVersion, nextVersion, strategy, resolvedVersion]) => {
		it(`${currentVersion}/${nextVersion}/${strategy} gives ${resolvedVersion}`, () => {
			expect(resolveNextVersion(currentVersion, nextVersion, strategy)).toBe(resolvedVersion);
		});
	});
});

describe("resolveReleaseType()", () => {
	// prettier-ignore
	const cases = [
		[
			"returns own package's _nextType if exists",
			{
				_nextType: "patch",
				_localDeps: [],
			},
			undefined,
			undefined,
			"patch",
		],
		[
			"implements `inherit` strategy: returns the highest release type of any deps",
			{
				manifest: { dependencies: { a: "1.0.0" } },
				_nextType: undefined,
				_localDeps: [
					{
						name: "a",
						manifest: { dependencies: { b: "1.0.0", c: "1.0.0", d: "1.0.0" } },
						_lastRelease: { version: "1.0.0" },
						_nextType: false,
						_localDeps: [
							{ name: "b", _nextType: false, _localDeps: [], _lastRelease: { version: "1.0.0" }  },
							{ name: "c", _nextType: "patch", _localDeps: [], _lastRelease: { version: "1.0.0" }  },
							{ name: "d", _nextType: "major", _localDeps: [], _lastRelease: { version: "1.0.0" }  },
						],
					},
				],
			},
			undefined,
			"inherit",
			"major"
		],
		[
			"overrides dependant release type with custom value if defined",
			{
				manifest: { dependencies: { a: "1.0.0" } },
				_nextType: undefined,
				_localDeps: [
					{
						name: "a",
						// _lastRelease: { version: "1.0.0" },
						manifest: { dependencies: { b: "1.0.0", c: "1.0.0", d: "1.0.0" } },
						_nextType: false,
						_localDeps: [
							{ name: "b", _nextType: false, _localDeps: [], _lastRelease: { version: "1.0.0" }  },
							{ name: "c", _nextType: "minor", _localDeps: [], _lastRelease: { version: "1.0.0" }  },
							{ name: "d", _nextType: "patch", _localDeps: [], _lastRelease: { version: "1.0.0" }  },
						],
					},
				],
			},
			undefined,
			"major",
			"major"
		],
		[
			"uses `patch` strategy as default (legacy flow)",
			{
				manifest: { dependencies: { a: "1.0.0" } },
				_nextType: undefined,
				_localDeps: [
					{
						name: "a",
						_nextType: false,
						//_lastRelease: { version: "1.0.0" },
						manifest: { dependencies: { b: "1.0.0", c: "1.0.0", d: "1.0.0" } },
						_localDeps: [
							{ name: "b", _nextType: false, _localDeps: [], _lastRelease: { version: "1.0.0" }  },
							{ name: "c", _nextType: "minor", _localDeps: [], _lastRelease: { version: "1.0.0" }  },
							{ name: "d", _nextType: "major", _localDeps: [], _lastRelease: { version: "1.0.0" }  },
						],
					},
				],
			},
			undefined,
			undefined,
			"patch"
		],
		[
			"returns undefined if no _nextRelease found",
			{
				_nextType: undefined,
				_localDeps: [
					{
						_nextType: false,
						_localDeps: [
							{ _nextType: false, _localDeps: [] },
							{
								_nextType: undefined,
								_localDeps: [
									{ _nextType: undefined, _localDeps: [] }
								]
							},
						],
					},
				],
			},
			undefined,
			undefined,
			undefined,
		],
	]

	cases.forEach(([name, pkg, bumpStrategy, releaseStrategy, result]) => {
		it(name, () => {
			expect(resolveReleaseType(pkg, bumpStrategy, releaseStrategy)).toBe(result);
		});
	});
});
