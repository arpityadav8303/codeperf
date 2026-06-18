// import { Request, Response } from "express";
// import { verifyGithubSignature } from "../utils/github.webhook";
// import { GitRepos } from "../repositiory/GitRepository.repo";
// import { Queue } from "bullmq";
// import { redisConnectionOptions } from "../config/redis.config";

// const analysisQueue = new Queue("analysis queue", { connection: redisConnectionOptions });

// export class WebhookController {

//     public async handleGithubWebhook(req: Request, res: Response): Promise<any> {
//         const rawBody = (req as any).rawBody as Buffer;
//         const signature = req.headers["x-hub-signature-256"] as string;
//         const event = req.headers["x-github-event"] as string;
//         const payload = req.body;

//         if (!signature || !rawBody) {
//             return res.status(400).json({ message: "Missing signature or body" });
//         }

//         const githubRepoId = String(payload.repository?.id);
//         const repo = await GitRepos.findOne({
//             where: { githubRepoId },
//             select: ["id", "webhookSecret", "isActive", "blockOnRegression"],
//             relations: ["user"]
//         });

//         if (!repo) {
//             return res.status(404).json({ message: "Repository not connected" });
//         }

//         const isValid = verifyGithubSignature(repo.webhookSecret, rawBody, signature);
//         if (!isValid) {
//             return res.status(401).json({ message: "Invalid webhook signature" });
//         }
//         res.status(200).json({ received: true });

//         if (event === "pull_request") {
//             const action = payload.action;

//             if (["opened", "synchronize", "reopened"].includes(action)) {
//                 const changedFiles = payload.pull_request?.changed_files
//                     ? [`${payload.pull_request.changed_files} files changed`]
//                     : [];

//                 await analysisQueue.add("analyzeGithubPR", {
//                     githubRepoId,
//                     userId: repo.user.id,
//                     prNumber: payload.pull_request.number,
//                     headSha: payload.pull_request.head.sha,
//                     changedFiles
//                 }, {
//                     attempts: 3,
//                     backoff: { type: "exponential", delay: 2000 }
//                 });

//                 console.log(`[Webhook] Queued PR #${payload.pull_request.number} for analysis`);
//             }
//         }

//         if (event === "ping") {
//             console.log(`[Webhook] Ping received for repo: ${githubRepoId}`);
//         }
//     }
// }

// export const webhookController = new WebhookController();

import { Request, Response } from 'express';
import * as crypto from 'crypto';

export async function handleGithubWebhook(req: Request, res: Response) {
    const signature = req.headers['x-hub-signature-256'] as string;
    if (!signature) {
        console.error('❌ Webhook rejected: Missing x-hub-signature-256 header.');
        return res.status(401).json({ success: false, message: 'Missing signature header' });
    }

    const secret = process.env.GITHUB_WEBHOOK_SECRET || '';
    const rawBody = (req as any).rawBody || '';

    // Compute the expected HMAC signature from the raw body text
    const computedSignature = `sha256=${crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex')}`;

    // Constant-time execution check to secure against timing side-channel attacks
    const isVerified = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(computedSignature)
    );

    if (!isVerified) {
        console.error('❌ Webhook rejected: Cryptographic HMAC signature verification failed.');
        return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    const payload = req.body;
    const eventType = req.headers['x-github-event'];

    console.log(`🤖 Valid GitHub Webhook Received. Event Type: ${eventType}`);

    // Return 200 OK immediately so GitHub doesn't timeout waiting for execution (3s limit)
    res.status(200).json({ success: true, message: 'Event acknowledged' });

    // Handle Pull Request events asynchronously
    if (eventType === 'pull_request') {
        const action = payload.action;
        
        if (action === 'opened' || action === 'synchronize') {
            const prNumber = payload.number;
            const repoFullName = payload.repository.full_name;
            const headSha = payload.pull_request.head.sha;
            const installationId = payload.installation?.id;

            console.log(`🚀 Triggering asynchronous CodePerf analysis loop for PR #${prNumber} on ${repoFullName} (commit: ${headSha})`);

            // TODO: BullMQ integration - pass this payload directly to your analysis queue!
            // await analysisQueue.add('github-pr-analysis', { repoFullName, prNumber, headSha, installationId });
        }
    }
}