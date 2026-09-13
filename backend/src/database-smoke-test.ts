import "reflect-metadata";
import assert from "assert";
import bcrypt from "bcrypt";
import { AppDataSource } from "./data-source";
import { User } from "./models/User";
import { Submission } from "./models/Submission";
import { UserRepository } from "./repositiory/auth.controller.repo";
import { GitRepos } from "./repositiory/GitRepository.repo";
import { SubmissionRepository } from "./repositiory/Submission.Repo";
import { BenchmarkRepository } from "./repositiory/Benchmark.Repo";
import { dashboardRepo } from "./repositiory/dashboard.repo";
import { UserService } from "./services/auth.services";
import { repositioryService } from "./services/Repository.services";

type Result = { name: string; status: "passed" | "failed"; detail?: unknown; error?: string };

const results: Result[] = [];

function recordPass(name: string, detail?: unknown) {
    results.push({ name, status: "passed", detail });
    console.log(`PASS ${name}`, detail ?? "");
}

function recordFail(name: string, error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    results.push({ name, status: "failed", error: message });
    console.log(`FAIL ${name} ${message}`);
}

async function check(name: string, operation: () => Promise<unknown>) {
    try {
        const detail = await operation();
        recordPass(name, detail);
        return detail;
    } catch (error) {
        recordFail(name, error);
        return undefined;
    }
}

async function run() {
    const marker = `dbprobe_${Date.now()}`;
    const email = `${marker}@example.test`;
    let user: User | null = null;
    let repository: { id: string } | undefined;
    let submission: Submission | undefined;

    try {
        await AppDataSource.initialize();
        recordPass("database connection");

        const userService = new UserService();
        const repositoryService = new repositioryService();
        const registered = await check("user creation", () => userService.register({
            name: "DB Probe",
            email: ` ${email.toUpperCase()} `,
            password: "ProbePassword!123"
        }));
        assert(registered && typeof registered === "object" && "id" in registered, "user creation did not produce a user");

        user = await UserRepository.findOneBy({ id: (registered as { id: string }).id });
        assert(user?.email === email, "user lookup returned the wrong user");
        recordPass("user lookup", user.id);

        const authRow = await UserRepository.createQueryBuilder("user")
            .addSelect("user.passwordHash")
            .where("user.email = :email", { email })
            .getOne();
        assert(authRow && await bcrypt.compare("ProbePassword!123", authRow.passwordHash), "password hash lookup/verification failed");
        recordPass("authentication database lookup and password verification");

        const githubUser = await userService.findOrCreateGithubUser({
            githubId: marker,
            name: "DB Probe GitHub",
            email,
            avatarUrl: "https://example.test/avatar",
            githubUsername: marker
        });
        assert(githubUser.id === user.id && githubUser.githubId === marker, "GitHub user association failed");
        recordPass("GitHub user lookup/create and update", githubUser.id);

        repository = await check("GitHub repository creation", () => repositoryService.connect(user!.id, {
            githubRepoId: marker,
            fullName: `codeperf/${marker}`
        })) as { id: string } | undefined;
        assert(repository, "repository creation did not produce a repository");

        const foundRepository = await check("repository lookup", () => repositoryService.findOne({
            where: { githubRepoId: marker, user: { id: user!.id } }
        }));
        assert(foundRepository && foundRepository.id === repository.id, "repository lookup failed");

        await check("repository update", async () => {
            const updateResult = await repositoryService.updateData(marker, user!.id, {
                blockOnRegression: true,
                regressionThresholdX: 1.5
            });
            assert(updateResult.affected === 1, "repository update affected no rows");
            const updated = await GitRepos.findOneBy({ id: repository!.id });
            assert(updated?.blockOnRegression === true && updated.regressionThresholdX === 1.5, "repository values were not updated");
            return updated.id;
        });

        await check("repository status update", async () => {
            const updateResult = await repositoryService.updateDataStatus(marker, user!.id, false);
            assert(updateResult.affected === 1, "repository status update affected no rows");
            const updated = await GitRepos.findOneBy({ id: repository!.id });
            assert(updated?.isActive === false, "repository status was not updated");
            return updated.isActive;
        });

        await check("repository filtered listing", async () => {
            const listed = await repositoryService.list(10, 0, [], [{ name: "githubRepoId", op: "is", value: marker }]);
            assert(listed.meta.total === 1 && listed.data[0].id === repository!.id, "repository listing returned wrong rows");
            return listed.meta.total;
        });

        submission = await check("submission and benchmark atomic creation", () => SubmissionRepository.createWithBenchmarksAtomic({
            code: "return n + 1;",
            language: "javascript",
            user: { id: user!.id },
            repository: { id: repository!.id }
        }, [10, 100])) as Submission | undefined;
        assert(submission && submission.status === "completed", "atomic submission did not complete");

        await check("submission retrieval with benchmarks", async () => {
            const row = await AppDataSource.getRepository(Submission).findOne({
                where: { id: submission!.id },
                relations: { user: true, repository: true, benchmarks: true }
            });
            assert(row && row.user.id === user!.id && row.repository?.id === repository!.id && row.benchmarks.length === 2, "submission relationships are incomplete");
            return row.benchmarks.length;
        });

        await check("benchmark retrieval", async () => {
            const rows = await BenchmarkRepository.find({
                where: { submission: { id: submission!.id } },
                relations: { submission: true }
            });
            assert(rows.length === 2 && rows.every((row) => row.submission.id === submission!.id), "benchmark retrieval or relation failed");
            return rows.length;
        });

        await check("submission history query", async () => {
            const rows = await SubmissionRepository.history(user!.id, repository!.id);
            assert(rows.length === 2, `expected 2 history rows, got ${rows.length}`);
            return rows.length;
        });

        await check("submission metrics query", async () => {
            const rows = await SubmissionRepository.getMetricsWithBaseline(user!.id, repository!.id);
            assert(rows.length === 2, `expected 2 metrics rows, got ${rows.length}`);
            return rows.length;
        });

        await check("submission list and dashboard queries", async () => {
            const list = await SubmissionRepository.findAllByUser(user!.id, 10, 0);
            const total = await dashboardRepo.getAllSubmission(user!.id);
            const active = await dashboardRepo.getConnectedRepoAct(user!.id);
            assert(list.total === 1 && total === 1 && active === 0, "list/dashboard counts are wrong");
            return { list: list.total, total, active };
        });

        await check("user-repository cascade relationship", async () => {
            const rows = await UserRepository.find({
                where: { id: user!.id },
                relations: { repositories: true, submissions: true }
            });
            assert(rows.length === 1 && rows[0].repositories.length === 1 && rows[0].submissions.length === 1, "user relationships are incomplete");
            return { repositories: rows[0].repositories.length, submissions: rows[0].submissions.length };
        });
    } catch (error) {
        recordFail("database flow harness", error);
    } finally {
        try {
            if (submission) {
                await BenchmarkRepository.delete({ submission: { id: submission.id } });
                await SubmissionRepository.delete({ id: submission.id });
            }
            if (repository) await GitRepos.delete({ id: repository.id });
            if (user) await UserRepository.delete({ id: user.id });
        } catch (error) {
            recordFail("probe cleanup", error);
        }
        if (AppDataSource.isInitialized) await AppDataSource.destroy();
        const passed = results.filter((result) => result.status === "passed").length;
        const failed = results.filter((result) => result.status === "failed").length;
        console.log(JSON.stringify({ passed, failed, results }, null, 2));
        process.exitCode = failed > 0 ? 1 : 0;
    }
}

void run();
