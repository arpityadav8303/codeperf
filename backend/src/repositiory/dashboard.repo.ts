import { AppDataSource } from "../data-source";
import { Submission } from "../models/Submission";
import { GitRepository } from "../models/Repository";

const submissionRepo = AppDataSource.getRepository(Submission);
const repoRepo = AppDataSource.getRepository(GitRepository);

export const dashboardRepo = {
    async getAllSubmission(userId: string,): Promise<any> {
        return submissionRepo
            .createQueryBuilder("submission")
            .where("submission.userId =:userId", { userId })
            .getCount();
    },

    async getComplexityDistribuition(userId: string,): Promise<any> {
        return submissionRepo
            .createQueryBuilder("submission")
            .select("submission.detectedComplexity", "complexity")
            .addSelect("COUNT(*)", "count")
            .where("submission.detectedComplexity IS NOT NULL")
            .andWhere("submission.userId = :userId", { userId })
            .groupBy("submission.detectedComplexity")
            .getRawMany();
    },

    async getConnectedRepoAct(userId: string): Promise<any> {
        return repoRepo
            .createQueryBuilder("repository")
            .where("repository.userId = :userId", { userId })
            .andWhere("repository.isActive = :isActive", { isActive: true })
            .getCount();
    },

    async getRegressionCountThisWeek(userId: string): Promise<number> {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        return submissionRepo
            .createQueryBuilder("submission")
            .where("submission.userId = :userId", { userId })
            .andWhere("submission.createdAt >= :from", { from: oneWeekAgo })
            .andWhere("submission.detectedComplexity IN (:...complexities)", {
                complexities: ["O(n²)", "O(n^2)", "O(n³)", "O(2^n)"]
            })
            .getCount();
    }
}
