import { AppDataSource } from "../data-source";
import { Submission } from "../models/Submission";
import { Benchmark } from "../models/Benchmark";

export const SubmissionRepository = AppDataSource.getRepository(Submission).extend({
    // Repository Layer
    async findAllByUser(userId: string, limit: number, offset: number, filters?: { language?: string; complexity?: string }): Promise<{ results: any[], total: number }> {
        const query = this.createQueryBuilder("submission")
            .where("submission.userId = :userId", { userId });

        if (filters?.language) {
            query.andWhere("submission.language = :language", { language: filters.language });
        }
        if (filters?.complexity) {
            query.andWhere("submission.detectedComplexity = :complexity", { complexity: filters.complexity });
        }

        query.orderBy("submission.createdAt", "DESC") // Newest first
            .skip(offset)
            .take(limit);

        const [results, total] = await query.getManyAndCount();
        return { results, total };
    },

    async history(userId: string, repoId: any): Promise<any> {
        const rawData = await this.createQueryBuilder("submission")
            .leftJoin("submission.benchmarks", "benchmark")
            .select("submission.id", "submissionId")
            .addSelect("submission.createdAt", "createdAt")
            .addSelect("benchmark.executionTimeMs", "executionTime")
            .addSelect("benchmark.inputSize", "inputSize")
            .addSelect(
                "ROW_NUMBER() OVER(PARTITION BY benchmark.inputSize ORDER BY submission.createdAt DESC)",
                "sequence_rank"
            )
            .where("submission.repositoryId = :repoId", { repoId })
            .andWhere("submission.userId = :userId", { userId })
            .getRawMany();
        return rawData;
    },

    async leaderBoard(userId: string, repoId: any): Promise<any> {
        const rawData = await this.createQueryBuilder("submission")
            .leftJoinAndSelect("submission.benchmarks", "benchmark")
            .leftJoinAndSelect("submission.user", "user")
            .select("user.name", "developerName")
            .addSelect("benchmark.executionTimeMs", "executionTime")
            .addSelect("RANK() OVER(PARTITION BY submission.language ORDER BY benchmark.executionTimeMs ASC)", "performance_rank")
            .where("submission.status = :status", { status: "completed" })
            .getRawMany();
        return rawData;
    },
    async getMetricsWithBaseline(userId: string, repoId: any): Promise<any[]> {
        return await this.createQueryBuilder("submission")
            .leftJoin("submission.benchmarks", "benchmark")
            .select("submission.id", "submissionId")
            .addSelect("submission.createdAt", "createdAt")
            .addSelect("benchmark.inputSize", "inputSize")
            .addSelect("benchmark.executionTimeMs", "currentExecutionTime")
            .addSelect(
                "LAG(benchmark.executionTimeMs, 1, NULL) OVER(PARTITION BY benchmark.inputSize ORDER BY submission.createdAt ASC)",
                "baselineExecutionTime"
            )
            .where("submission.repositoryId = :repoId", { repoId })
            .andWhere("submission.userId = :userId", { userId })
            .orderBy("submission.createdAt", "DESC")
            .getRawMany();
    },
    /**
     * Fetches the 5 most recent submissions for each user along with 
     * their detected asymptotic time complexity.
    */
    async getTop5SubmissionsPerUser(userId: string): Promise<any[]> {
        const subQuery = this.createQueryBuilder("sub")
            .select("sub.id", "id")
            .addSelect("sub.userId", "userId")
            .addSelect("sub.language", "language")
            .addSelect("sub.detectedComplexity", "detectedComplexity")
            .addSelect("sub.createdAt", "createdAt")
            .addSelect(
                "ROW_NUMBER() OVER(PARTITION BY sub.userId ORDER BY sub.createdAt DESC)",
                "row_num"
            );
        const results = await this.manager.connection
            .createQueryBuilder()
            .select("ranked.*")
            .from(`(${subQuery.getQuery()})`, "ranked")
            .setParameters(subQuery.getParameters())
            .where("ranked.row_num <= 5")
            .andWhere("ranked.userId = :userId", { userId })
            .getRawMany();

        return results;
    },

    async createLightweightShell(code: string, language: string, userId: string): Promise<Submission> {
        const submissionInstance = this.create({
            code,
            language,
            status: "queued",
            detectedComplexity: null,
            confidence: null,
            user: { id: userId } as any
        });

        return await this.save(submissionInstance);
    },

    async createWithBenchmarksAtomic( submissionData: Partial<Submission>, inputSizes: number[] ): Promise<Submission> {
        // Create an isolated query runner to manage the transaction lifecycle
        const queryRunner = AppDataSource.createQueryRunner();

        // Establish connection and start transaction (BEGIN)
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Insert initial submission (implicitly defaults to 'queued')
            const submissionInstance = queryRunner.manager.create(Submission, {
                ...submissionData,
                status: "queued"
            });
            const savedSubmission = await queryRunner.manager.save(submissionInstance);

            // Generate mock benchmark datasets mapping back to the saved submission
            const mockBenchmarks = inputSizes.map((size) => {
                return queryRunner.manager.create(Benchmark, {
                    submission: savedSubmission,
                    inputSize: size,
                    executionTimeMs: Number((Math.random() * (size / 100) + 1).toFixed(2)),
                    memoryUsedKb: Number((Math.random() * (size / 50) + 1024).toFixed(2))
                } as Benchmark);
            });

            // Bulk insert benchmarks within the same transaction context
            await queryRunner.manager.save(Benchmark, mockBenchmarks);

            // Update the submission status directly within the transaction block
            savedSubmission.status = "completed";
            const finalSubmission = await queryRunner.manager.save(savedSubmission);

            // Commit changes permanently to disk (COMMIT)
            await queryRunner.commitTransaction();
            return finalSubmission;

        } catch (error) {
            // Rollback EVERYTHING if any single step fails (ROLLBACK)
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Always release connection back to connection pool
            await queryRunner.release();
        }
    }
});
