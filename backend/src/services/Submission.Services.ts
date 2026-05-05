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

    async processSubmission(code: string, language: string, userId: string): Promise<any> {
        // 1. Save the submission (defaults to 'queued')
        const initialSubmission = await this.subRepo.save({
            code: code,
            language: language,
            user: { id: userId }
        } as Submission);

        // 2. Create and save mock benchmark results matching the Benchmark entity
        // We use an array of increasing input sizes to simulate Big-O scaling
        const inputSizes = [10, 100, 1000, 10000, 50000, 100000];

        const mockBenchmarks: Benchmark[] = inputSizes.map((size) => ({
            submission: initialSubmission,
            inputSize: size,
            // Mocking execution time and memory to scale roughly with input size
            executionTimeMs: Number((Math.random() * (size / 100) + 1).toFixed(2)),
            memoryUsedKb: Number((Math.random() * (size / 50) + 1024).toFixed(2))
        } as Benchmark));

        await this.benchRepo.save(mockBenchmarks);

        // 3. Update submission status to 'completed'
        initialSubmission.status = 'completed';
        const completedSubmission = await this.subRepo.save(initialSubmission);

        // 4. Return the completed submission
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
    async list(userId: string, page: number, limit: number, filters?: { language?: string; complexity?: string }) {
        const validatedPage = Math.max(1, page);
        const validatedLimit = Math.min(50, Math.max(1, limit));
        const offset = (validatedPage - 1) * validatedLimit;
        const { results, total } = await this.subRepo.findAllByUser(userId, validatedLimit, offset, filters);
        const totalPages = Math.ceil(total / validatedLimit);
        return {
            success: true,
            data: results,
            total,
            page: validatedPage,
            totalPages,
            message: "Submission history retrieved successfully"
        };
    }

    async getAIReview(userId: string, submissionId: any) {
    // 1. Verify submission exists and belongs to the user
    const submission = await this.subRepo.findOne({ 
        where: { id: submissionId} 
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