import { getPullRequestFiles } from '../utils/github';
import { Queue } from "bullmq";
import { GitRepos } from "../repositiory/GitRepository.repo";
import { redisConnectionOptions } from "../config/redis.config";
export class GithubService {
    private analysisQueue = new Queue("analysis queue", { connection: redisConnectionOptions });

    public pullRequestEventHandler = async (installationId: number, repoFullName: string, prNumber: number, headSha: string) => {


        // --------------------------------
        // 1. Find connected repository
        // --------------------------------
        const connectedRepo = await GitRepos.findOne({ where: { fullName: repoFullName }, relations: ["user"] });

        if (!connectedRepo || !connectedRepo.isActive) {
            return;
        }

        // --------------------------------
        // 2. Get changed files from GitHub
        // --------------------------------

        const changedFiles = await getPullRequestFiles(installationId, repoFullName, prNumber);
        // --------------------------------
        // 3. Add analysis job to BullMQ
        // --------------------------------

        await this.analysisQueue.add("analyzeGithubPR", { githubRepoId: String(connectedRepo.githubRepoId), userId: String(connectedRepo.user.id), prNumber, headSha, changedFiles });
    };
}






