const { tag } = require("semantic-release/lib/git");
const { highest, lowest, getLatestVersion, tagsToVersions } = require("../../lib/utils");

describe("tagsToVersions()", () => {
	// prettier-ignore
	const cases = [
        [[{version: "1.0.0"}, {version: "1.1.0"}, {version: "1.2.0"}], ["1.0.0", "1.1.0", "1.2.0"]],
        [[],[]],
        [undefined, []],
        [null, []],
	]

	cases.forEach(([tags, versions]) => {
		it(`${tags} gives versions as ${versions}`, () => {
			expect(tagsToVersions(tags)).toStrictEqual(versions);
		});
	});
});

describe("highest()", () => {
	// prettier-ignore
	const cases = [
		["1.0.0", "2.0.0", "2.0.0"],
        ["1.1.1", "1.0.0", "1.1.1"],
        [null, "1.0.0", "1.0.0"],
        ["1.0.0", undefined, "1.0.0"],
        [undefined, undefined, undefined],
	]

	cases.forEach(([version1, version2, high]) => {
		it(`${version1}/${version2} gives highest as ${high}`, () => {
			expect(highest(version1, version2)).toBe(high);
		});
	});
});

describe("lowest()", () => {
	// prettier-ignore
	const cases = [
		["1.0.0", "2.0.0", "1.0.0"],
        ["1.1.1", "1.0.0", "1.0.0"],
        [null, "1.0.0", "1.0.0"],
        ["1.0.0", undefined, "1.0.0"],
        [undefined, undefined, undefined],
	]

	cases.forEach(([version1, version2, low]) => {
		it(`${version1}/${version2} gives lowest as ${low}`, () => {
			expect(lowest(version1, version2)).toBe(low);
		});
	});
});

describe("getLatestVersion()", () => {
	// prettier-ignore
	const cases = [
		[["1.2.3-alpha.3", "1.2.0", "1.0.1", "1.0.0-alpha.1"], null, "1.2.0"],
        [["1.2.3-alpha.3", "1.2.3-alpha.2"], null, undefined],
        [["1.2.3-alpha.3", "1.2.0", "1.0.1", "1.0.0-alpha.1"], true, "1.2.3-alpha.3"],
        [["1.2.3-alpha.3", "1.2.3-alpha.2"], true, "1.2.3-alpha.3"],
        [[], {}, undefined]
	]

	cases.forEach(([versions, withPrerelease, latest]) => {
		it(`${versions}/${withPrerelease} gives latest as ${latest}`, () => {
			expect(getLatestVersion(versions, withPrerelease)).toBe(latest);
		});
	});
});
