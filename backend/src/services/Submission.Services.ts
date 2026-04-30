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
}