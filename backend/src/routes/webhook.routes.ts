import { Router } from 'express';

import { WebhookController } from '../controllers/webhook.controller';

const router = Router();
const webhookController = new WebhookController();

// Endpoint mapped to: POST /api/v1/webhooks/github
router.post('/github', (req, res) => webhookController.handleGithubWebhook(req, res));

export default router;