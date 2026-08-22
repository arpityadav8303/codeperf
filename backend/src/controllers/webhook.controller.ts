import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { GithubService } from '../services/webHook.services';
export class WebhookController {
    constructor(private gitHubService = new GithubService()) { }
    public async handleGithubWebhook(req: Request, res: Response) {
        const signature = req.headers['x-hub-signature-256'] as string;
        if (!signature) {
            return res.status(401).json({ success: false, message: 'Missing signature header' });
        }
        const secret = process.env.GITHUB_WEBHOOK_SECRET || '';
        const rawBody = (req as any).rawBody || '';
        const computedSignature = `sha256=${crypto
            .createHmac('sha256', secret)
            .update(rawBody)
            .digest('hex')}`;

        const isVerified = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature));

        if (!isVerified) {
            return res.status(401).json({ success: false, message: 'Invalid signature' });
        }
        const payload = req.body;
        const eventType = req.headers['x-github-event'];
        console.log(eventType,'eventype-=-=-=-=')
        console.log(payload,'payload=-=-=-=-=');
        res.status(200).json({ success: true, message: 'Event acknowledged' });

        if (eventType === 'pull_request') {
            const action = payload.action;

            if (action === 'opened' || action === 'synchronize') {
                const prNumber = payload.number;
                const repoFullName = payload.repository.full_name;
                const headSha = payload.pull_request.head.sha;
                const installationId = payload.installation?.id;

                console.log(`🚀 Triggering asynchronous CodePerf analysis loop for PR #${prNumber} on ${repoFullName} (commit: ${headSha})`);
                await this.gitHubService.pullRequestEventHandler(installationId, repoFullName, prNumber, headSha);
                // TODO: BullMQ integration - pass this payload directly to your analysis queue!
                // await analysisQueue.add('github-pr-analysis', { repoFullName, prNumber, headSha, installationId });
            }
        }
    }

}
