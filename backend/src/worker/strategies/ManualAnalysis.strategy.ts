import { AppDataSource } from "../../data-source";
import { Submission } from "../../models/Submission";
import { Benchmark } from "../../models/Benchmark";
import { sendToSubscribers } from "../../services/notification.service";

export class ManualAnalysisStrategy {
    private subRepo = AppDataSource.getRepository(Submission);

    async execute(data: { submissionId: string; code: string; language: string }): Promise<void> {
        const { submissionId } = data;

        // 1. Update status to running
        await this.subRepo.update(submissionId, { status: "running" });
        sendToSubscribers(submissionId, {
            type: "progress",
            submissionId,
            progress: 10,
            status: "running"
        });

        // 2. Simulate analysis delay
        await new Promise((resolve) => setTimeout(resolve, 4000));

        // 3. Mock metrics (Phase 3 will replace this with real C++ execution)
        const detectedComplexity = "O(n)";
        const confidenceScore = 0.85;
        const inputSizes = [10, 100, 1000, 10000, 50000, 100000];

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const benchmarks = inputSizes.map((size) => {
                return queryRunner.manager.create(Benchmark, {
                    submission: { id: submissionId } as Submission,
                    inputSize: size,
                    executionTimeMs: Number((Math.random() * (size / 100) + 1).toFixed(2)),
                    memoryUsedKb: Number((Math.random() * (size / 50) + 1024).toFixed(2))
                });
            });
            await queryRunner.manager.save(Benchmark, benchmarks);

            // 4. Complete submission
            await queryRunner.manager.update(Submission, submissionId, {
                status: "completed",
                detectedComplexity,
                confidence: confidenceScore
            });
            await queryRunner.commitTransaction();
            // After commitTransaction():
            sendToSubscribers(submissionId, {
                type: "completed",
                submissionId,
                detectedComplexity,
                confidence: confidenceScore
            });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            await this.subRepo.update(submissionId, { status: "failed" });
            sendToSubscribers(submissionId, {
                type: "failed",
                submissionId,
                error: "Analysis failed"
            });
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}