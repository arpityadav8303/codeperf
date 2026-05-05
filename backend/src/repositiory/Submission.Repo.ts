import { AppDataSource } from "../data-source";
import { Submission } from "../models/Submission";

export const SubmissionRepository = AppDataSource.getRepository(Submission).extend({
    // Repository Layer
async findAllByUser( userId: string, limit: number, offset: number, filters?: { language?: string; complexity?: string }): Promise<{ results: any[], total: number }> {
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
}
});