import { SubmissionRepository } from "../repositiory/Submission.Repo";
import { BenchmarkRepository } from "../repositiory/Benchmark.Repo";
import { Submission } from "../models/Submission";
import { Benchmark } from "../models/Benchmark";
import { AppDataSource } from "../data-source"

export class SubmissionService {
    constructor(
        private subRepo = SubmissionRepository,
        private benchRepo = BenchmarkRepository,
    ) { }

    async processSubmission(code: string, language: string, userId: string): Promise<Submission> {
        const detectedComplexity = "O(n)";
        const confidenceScore = 0.85;

        const inputSizes = [10, 100, 1000, 10000, 50000, 100000];

        const submissionPayload: Partial<Submission> = {
            code,
            language,
            detectedComplexity,
            confidence: confidenceScore,
            user: { id: userId } as any
        };

        const completedSubmission = await this.subRepo.createWithBenchmarksAtomic(
            submissionPayload,
            inputSizes
        );

        return completedSubmission;
    }

    async findById(id: any): Promise<any> {
        return this.subRepo.findOneBy({ id });
    }

    async findWithBenchmark(id: any): Promise<any> {
        const result = await AppDataSource
            .getRepository(Submission)
            .createQueryBuilder("submission")
            .leftJoinAndSelect("submission.benchmarks", "benchmark")
            .where("submission.id = :id", { id })
            .getOne();

        return result;
    }
    async list(userId: string, limit: number, offset: number, filters?: { language?: string; complexity?: string }) {
        const { results, total } = await this.subRepo.findAllByUser(userId, limit, offset, filters);
        console.log(limit, '=====limit');
        const totalPages = Math.ceil(total / limit);
        return {
            success: true,
            data: results,
            total,
            offset,
            totalPages,
            message: "Submission history retrieved successfully"
        };
    }

    async getAIReview(userId: string, submissionId: any) {
        // 1. Verify submission exists and belongs to the user
        const submission = await this.subRepo.findOne({
            where: { id: submissionId }
        });

        if (!submission) {
            throw new Error("Submission not found or unauthorized");
        }

        // 2. Return structured placeholder
        // This structure remains the same when real AI is added in Phase 4
        return {
            submissionId: submission.id,
            review: "AI review coming in Phase 4", // Grounded review will go here
            suggestedFix: null, // Refactored code snippet will go here
            status: "placeholder",
            generatedAt: new Date()
        };
    }
}