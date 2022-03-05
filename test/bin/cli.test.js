import execa from "execa";
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
import {dirname} from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url))

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
		const out = (await execa("node", [filepath, "-- --no-sequential-prepare"], { cwd })).stdout;
		expect(out).toMatch("Started multirelease! Loading 4 packages...");
		expect(out).toMatch("Released 4 of 4 packages, semantically!");
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
		const out = (await execa("node", [filepath, "--ignore-packages=packages/c/**,packages/d/**"], { cwd })).stdout;
		expect(out).toMatch("Started multirelease! Loading 2 packages...");
		expect(out).toMatch("Released 2 of 2 packages, semantically!");
	});
});
