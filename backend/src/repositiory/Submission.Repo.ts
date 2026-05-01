import { AppDataSource } from "../data-source";
import { Submission } from "../models/Submission";

export const SubmissionRepository = AppDataSource.getRepository(Submission).extend({
    async getAllSubmissions(userId: string,limit: number,offset: number, filters?: { language?: string; complexity?: string }):Promise<any> {
        const query = this.createQueryBuilder("submission")
        .where("submission.userId = :userId", { userId })
        if(filters?.language) {
            query.andWhere("submission.language = :language", { language:filters.language})
        }
        if(filters?.complexity) {
            query.andWhere("submission.complexity = :complexity", {complexity: filters.complexity})
        }
        query.orderBy("createdAt")
        query.limit(limit)
        query.offset(offset)
        const [result, count] = await query.getManyAndCount();
        return {result, count};
    }
});