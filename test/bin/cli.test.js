import { execa } from "execa";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { copyDirectory } from "../helpers/file.js";
import {
	gitInit,
	gitAdd,
	gitCommit,
	gitCommitAll,
	gitInitOrigin,
	gitPush,
	gitTag,
	gitGetTags,
} from "../helpers/git.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Tests.
describe("multi-semantic-release CLI", () => {
	test("Initial commit (changes in all packages)", async () => {
		// Create Git repo with copy of Yarn workspaces fixture.
		const cwd = gitInit();
		copyDirectory(`test/fixtures/yarnWorkspaces/`, cwd);
		const sha = gitCommitAll(cwd, "feat: Initial release");
		const url = gitInitOrigin(cwd);
		gitPush(cwd);

		// Path to CLI command.
		const filepath = `${__dirname}/../../bin/cli.js`;

		// Run via command line.
		// const out = (await execa("node", [filepath, "-- --no-sequential-prepare"], { cwd })).stdout;
		// expect(out).toMatch("Started multirelease! Loading 4 packages...");
		// expect(out).toMatch("Released 4 of 4 packages, semantically!");

		try {
			await execa("node", [filepath, "-- --no-sequential-prepare --no-ci"], { cwd });
		} catch (res) {
			const { stdout, stderr, exitCode } = res;

			expect(stdout).toMatch("Started multirelease! Loading 4 packages...");
			expect(stderr).toMatch('Error: Cyclic dependency, node was:"msr-test-c"');
			expect(exitCode).toBe(1);
		}
	});

	test("Initial commit (changes in 2 packages, 2 filtered out)", async () => {
		// Create Git repo with copy of Yarn workspaces fixture.
		const cwd = gitInit();
		copyDirectory(`test/fixtures/yarnWorkspaces/`, cwd);
		const sha = gitCommitAll(cwd, "feat: Initial release");
		const url = gitInitOrigin(cwd);
		gitPush(cwd);

		// Path to CLI command.
		const filepath = `${__dirname}/../../bin/cli.js`;

		// Run via command line.
		const out = (
			await execa("node", [filepath, "-- --ignore-packages=packages/c/**,packages/d/**  --no-ci"], { cwd })
		).stdout;
		expect(out).toMatch("Started multirelease! Loading 2 packages...");
		expect(out).toMatch("Released 2 of 2 packages, semantically!");
	});
});
