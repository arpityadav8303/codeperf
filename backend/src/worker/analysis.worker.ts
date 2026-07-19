import { Worker, Job } from "bullmq";
import { redisConnectionOptions } from "../config/redis.config";
import { ManualAnalysisStrategy } from "./strategies/ManualAnalysis.strategy";
import { GithubPRAnalysisStrategy } from "./strategies/GithubPRAnalysis.strategy";

// Instantiate strategies
const manualAnalysis = new ManualAnalysisStrategy();
const githubPRAnalysis = new GithubPRAnalysisStrategy();

export const worker = new Worker("analysis queue", async (job: Job) => {
    console.log(`[Worker] Processing Job ${job.id} of type: ${job.name}`);

    try {
        switch (job.name) {
            
            case "analyzeManualSubmission":
                return await manualAnalysis.execute(job.data);
         
            case "analyzeGithubPR":
                // In the future: return await githubPRAnalysis.execute(job.data);
                console.log("[Worker] PR analysis coming up in Week 11");
                return await githubPRAnalysis.execute(job.data);

            default:
                throw new Error(`Unhandled job type: ${job.name}`);
        }
    } catch (error) {
        console.error(`[Worker Error] Job ${job.id} failed:`, error);
        throw error; // Let BullMQ handle retries natively
    }
}, {
    connection: redisConnectionOptions
});