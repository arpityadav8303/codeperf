import { getPullRequestFiles } from '../utils/github';
import { Queue } from "bullmq";
import { GitRepos } from "../repositiory/GitRepository.repo";
import { redisConnectionOptions } from "../config/redis.config";
export class GithubService {
    private analysisQueue = new Queue("analysis queue", { connection: redisConnectionOptions });

    public pullRequestEventHandler = async (installationId: number, repoFullName: string, prNumber: number, headSha: string) => {
        const connectedRepo = await GitRepos.findOne({ where: { fullName: repoFullName }, relations: ["user"] });

        if (!connectedRepo || !connectedRepo.isActive) {
            return;
        }
        const changedFiles = await getPullRequestFiles(installationId, repoFullName, prNumber);
        await this.analysisQueue.add("analyzeGithubPR", { githubRepoId: String(connectedRepo.githubRepoId), userId: String(connectedRepo.user.id), prNumber, headSha, changedFiles });
    };
}






