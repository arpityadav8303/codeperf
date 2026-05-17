import { AppDataSource } from "../data-source";
import { Submission } from "../models/Submission";

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
    async getTop5SubmissionsPerUser(): Promise<any[]> {
        // 1. Construct the inner query that builds the chronological row sequence counter
        const subQuery = this.createQueryBuilder("sub")
            .select("sub.id", "id")
            .addSelect("sub.userId", "userId")
            .addSelect("sub.language", "language")
            .addSelect("sub.detectedComplexity", "detectedComplexity")
            .addSelect("sub.createdAt", "createdAt")
            // Partitions by user boundaries, matching the newest item with sequence 1
            .addSelect(
                "ROW_NUMBER() OVER(PARTITION BY sub.userId ORDER BY sub.createdAt DESC)",
                "row_num"
            );

        // 2. Wrap it inside a main data-source query to execute the upper limit row filtering
        const results = await this.manager.connection
            .createQueryBuilder()
            .select("ranked.*")
            .from(`(${subQuery.getQuery()})`, "ranked")
            .setParameters(subQuery.getParameters())
            .where("ranked.row_num <= 5")
            .getRawMany();

        return results;
    }
});