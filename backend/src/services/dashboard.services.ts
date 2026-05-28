import { dashboardRepo } from "../repositiory/dashboard.repo";
import { AppDataSource } from "../data-source"
import { SubmissionRepository } from "../repositiory/Submission.Repo";

export class dashboardService {
    constructor(
        private dashrepo = dashboardRepo,
        private subRepo = SubmissionRepository,
    ) {}

    public async getStats(userId: string): Promise<any>{
        const [
            totalSubmissions,
            complexityDistribution,
            recentSubmissions,
            connectedReposCount,
            regressionCountThisWeek
        ] = await Promise.all([
            this.dashrepo.getAllSubmission(userId),
            this.dashrepo.getComplexityDistribuition(userId),
            this.subRepo.getTop5SubmissionsPerUser(userId),
            this.dashrepo.getConnectedRepoAct(userId),
            this.dashrepo.getRegressionCountThisWeek(userId)
        ]);

        return {
            totalSubmissions,
            complexityDistribution,
            recentSubmissions,
            connectedReposCount,
            regressionCountThisWeek
        };
    }
}