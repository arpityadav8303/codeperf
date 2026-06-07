import { Request, Response } from "express";
import { verifyGithubSignature } from "../utils/github.webhook";
import { GitRepos } from "../repositiory/GitRepository.repo";
import { Queue } from "bullmq";
import { redisConnectionOptions } from "../config/redis.config";

const analysisQueue = new Queue("analysis queue", { connection: redisConnectionOptions });

export class WebhookController {

    public async handleGithubWebhook(req: Request, res: Response): Promise<any> {
        const rawBody = (req as any).rawBody as Buffer;
        const signature = req.headers["x-hub-signature-256"] as string;
        const event = req.headers["x-github-event"] as string;
        const payload = req.body;

        if (!signature || !rawBody) {
            return res.status(400).json({ message: "Missing signature or body" });
        }

        const githubRepoId = String(payload.repository?.id);
        const repo = await GitRepos.findOne({
            where: { githubRepoId },
            select: ["id", "webhookSecret", "isActive", "blockOnRegression"],
            relations: ["user"]
        });

        if (!repo) {
            return res.status(404).json({ message: "Repository not connected" });
        }

        const isValid = verifyGithubSignature(repo.webhookSecret, rawBody, signature);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid webhook signature" });
        }
        res.status(200).json({ received: true });

        if (event === "pull_request") {
            const action = payload.action;

            if (["opened", "synchronize", "reopened"].includes(action)) {
                const changedFiles = payload.pull_request?.changed_files
                    ? [`${payload.pull_request.changed_files} files changed`]
                    : [];

                await analysisQueue.add("analyzeGithubPR", {
                    githubRepoId,
                    userId: repo.user.id,
                    prNumber: payload.pull_request.number,
                    headSha: payload.pull_request.head.sha,
                    changedFiles
                }, {
                    attempts: 3,
                    backoff: { type: "exponential", delay: 2000 }
                });

                console.log(`[Webhook] Queued PR #${payload.pull_request.number} for analysis`);
            }
        }

        if (event === "ping") {
            console.log(`[Webhook] Ping received for repo: ${githubRepoId}`);
        }
    }
}

export const webhookController = new WebhookController();