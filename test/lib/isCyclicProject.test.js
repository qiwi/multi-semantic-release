const isCyclicProject = require("../../lib/isCyclicProject");

// Tests.
describe("isCyclicProject()", () => {
	const pkgA = {
		name: "pkgA",
		localDeps: [],
	};

	const pkgB = {
		name: "pkgB",
		localDeps: [],
	};

	const pkgC = {
		name: "pkgC",
		localDeps: [pkgB],
	};

	const pkgE = {
		name: "pkgD",
		localDeps: [],
	};

	const pkgD = {
		name: "pkgD",
		localDeps: [pkgE],
	};

	pkgE.localDeps = [pkgD];

	test("With independent packages", () => {
		expect(isCyclicProject([pkgA, pkgB])).toBeFalsy();
	});
	test("With simple chain", () => {
		expect(isCyclicProject([pkgB, pkgC])).toBeFalsy();
	});

	test("With cyclic dependency", () => {
		expect(isCyclicProject([pkgD, pkgD])).toBeTruthy();
	});
});
