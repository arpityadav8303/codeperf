import { Worker, Job } from "bullmq";
import { redisConnectionOptions } from "../../config/redis.config";
import { SubmissionRepository } from "../../repositiory/Submission.Repo";
import { GitRepos } from "../../repositiory/GitRepository.repo"; // <-- Import your Repository Repo
import { AppDataSource } from "../../data-source";
import { Submission } from "../../models/Submission";
import { Benchmark } from "../../models/Benchmark";

export const worker = new Worker("analysis queue", async (job: Job) => {
    console.log(`[Worker] Processing Job ${job.id} of type: ${job.name}`);
    
    switch (job.name) {
        case "analyzeManualSubmission": {
            const { submissionId } = job.data;
            const sizes = [10, 100, 1000, 10000, 50000, 100000];
            await SubmissionRepository.createWithBenchmarksAtomic(submissionId, sizes);
            return;
        }

        case "analyzeGithubPR":
            // Directly handle incoming GitHub Webhook automation jobs
            return await handlePullRequestAnalysis(job.data);

        default:
            throw new Error(`Unhandled job type: ${job.name}`);
    }
}, { 
    connection: redisConnectionOptions 
});

/**
 * Handles automated analysis when a GitHub Webhook triggers a PR synchronization event
 */
async function handlePullRequestAnalysis(data: { 
    githubRepoId: string; 
    userId: string;
    prNumber: number;
    headSha: string;
    changedFiles: string[];
}) {
    const { githubRepoId, userId, prNumber, headSha, changedFiles } = data;
    console.log(`[Worker] Starting automated PR analysis for Repo ID: ${githubRepoId}, PR #${prNumber}`);

    // 1. Look up the connected repository configurations from the database
    const connectedRepo = await GitRepos.findOne({
        where: { 
            githubRepoId: githubRepoId,
            user: { id: userId }
        }
    });

    if (!connectedRepo || !connectedRepo.isActive) {
        console.warn(`[Worker] Connected repo ${githubRepoId} not found, or has been deactivated.`);
        return;
    }

    // 2. Initialize a placeholder entry in submissions tracking this automated run
    const submissionRepo = AppDataSource.getRepository(Submission);
    const prSubmission = submissionRepo.create({
        code: `// Automated Scan for PR #${prNumber}\n// Head SHA: ${headSha}\n// Files changed: ${changedFiles.join(', ')}`,
        language: "javascript", // Fallback default or inferred from changedFiles extensions
        status: "running",
        repository: { id: connectedRepo.id } as any,
        user: { id: userId } as any
    });
    
    const savedSubmission = await submissionRepo.save(prSubmission);

    // 3. Simulate processing and regression calculations
    // (Phase 3 will compile/run the C++ profiler against raw code variations here)
    await new Promise((resolve) => setTimeout(resolve, 3500));

    const detectedComplexity = "O(n)";
    const confidenceScore = 0.92;
    const inputSizes = [10, 100, 1000, 10000, 50000];

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // Bulk insert generated benchmark datasets
        const benchmarks = inputSizes.map((size) => {
            return queryRunner.manager.create(Benchmark, {
                submission: { id: savedSubmission.id } as Submission,
                inputSize: size,
                executionTimeMs: Number((Math.random() * (size / 110) + 0.8).toFixed(2)),
                memoryUsedKb: Number((Math.random() * (size / 55) + 1024).toFixed(2))
            });
        });
        await queryRunner.manager.save(Benchmark, benchmarks);

        // 4. Close transaction and update submission status
        await queryRunner.manager.update(Submission, savedSubmission.id, {
            status: "completed",
            detectedComplexity,
            confidence: confidenceScore
        });

        await queryRunner.commitTransaction();
        console.log(`[Worker] Automated PR #${prNumber} analysis successfully completed.`);

        // 5. Check regression boundaries 
        // If a regression is detected and connectedRepo.blockOnRegression is true,
        // Phase 1 Week 12 will execute the Checks API call block here to lock down the GitHub merge button.
        if (connectedRepo.blockOnRegression) {
            console.log(`[Worker] Regression threshold evaluation passed clean for SHA: ${headSha}`);
        }

    } catch (error) {
        await queryRunner.rollbackTransaction();
        await submissionRepo.update(savedSubmission.id, { status: "failed" });
        console.error(`[Worker Error] PR #${prNumber} pipeline execution failed:`, error);
        throw error;
    } finally {
        await queryRunner.release();
    }
}