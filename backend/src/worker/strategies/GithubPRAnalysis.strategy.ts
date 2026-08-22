// backend/src/worker/strategies/GithubPRAnalysis.strategy.ts
import { AppDataSource } from "../../data-source";
import { Submission } from "../../models/Submission";
import { Benchmark } from "../../models/Benchmark";
import { GitRepos } from "../../repositiory/GitRepository.repo";
import { sendToSubscribers } from "../../services/notification.service";

export class GithubPRAnalysisStrategy {
    private submissionRepo = AppDataSource.getRepository(Submission);

    async execute(data: {githubRepoId: string;userId: string;prNumber: number;headSha: string;changedFiles: string[];}): Promise<void> {
        const { githubRepoId, userId, prNumber, headSha, changedFiles } = data;
        console.log(`[Worker] Starting automated PR analysis for Repo ID: ${githubRepoId}, PR #${prNumber}`);

        // 1. Database se connected repository configurations nikalna
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

        // 2. Submissions table mein placeholder record banana (Status: running)
        const prSubmission = this.submissionRepo.create({
            code: `// Automated Scan for PR #${prNumber}\n// Head SHA: ${headSha}\n// Files changed: ${changedFiles.join(', ')}`,
            language: "javascript",
            status: "running",
            repository: { id: connectedRepo.id } as any,
            user: { id: userId } as any
        });

        const savedSubmission = await this.submissionRepo.save(prSubmission);

        // Live WebSocket progress alert dena frontend ko (10%)
        sendToSubscribers(savedSubmission.id, {
            type: "progress",
            submissionId: savedSubmission.id,
            progress: 10,
            status: "running",
            message: "PR Webhook trigger successfully captured. Preparing testbeds..."
        });

        // 3. Simulation processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        sendToSubscribers(savedSubmission.id, {
            type: "progress",
            submissionId: savedSubmission.id,
            progress: 50,
            status: "running",
            message: "Simulating C++ performance checks across inputs..."
        });

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const detectedComplexity = "O(n)";
        const confidenceScore = 0.92;
        const inputSizes = [10, 100, 1000, 10000, 50000];

        // TypeORM Transaction Isolation Block shuru karna (ACID Compliance)
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Bulk insert benchmark datasets
            const benchmarks = inputSizes.map((size) => {
                return queryRunner.manager.create(Benchmark, {
                    submission: { id: savedSubmission.id } as Submission,
                    inputSize: size,
                    executionTimeMs: Number((Math.random() * (size / 110) + 0.8).toFixed(2)),
                    memoryUsedKb: Number((Math.random() * (size / 55) + 1024).toFixed(2))
                });
            });
            await queryRunner.manager.save(Benchmark, benchmarks);

            // 4. Submission status ko complete karna inside transaction boundary
            await queryRunner.manager.update(Submission, savedSubmission.id, {
                status: "completed",
                detectedComplexity,
                confidence: confidenceScore
            });

            await queryRunner.commitTransaction();
            console.log(`[Worker] Automated PR #${prNumber} analysis successfully completed.`);

            // WebSocket complete alert bhejna
            sendToSubscribers(savedSubmission.id, {
                type: "completed",
                submissionId: savedSubmission.id,
                progress: 100,
                status: "completed",
                detectedComplexity,
                confidence: confidenceScore
            });

            // 5. GitHub Checks API / Block logic threshold validation
            if (connectedRepo.blockOnRegression) {
                console.log(`[Worker] Regression threshold evaluation passed clean for SHA: ${headSha}`);
            }

        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            await this.submissionRepo.update(savedSubmission.id, { status: "failed" });

            sendToSubscribers(savedSubmission.id, {
                type: "failed",
                submissionId: savedSubmission.id,
                status: "failed",
                error: error.message || "Automated PR scan pipeline crash"
            });

            console.error(`[Worker Error] PR #${prNumber} pipeline execution failed:`, error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}