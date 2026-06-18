import { Router } from 'express';
import { handleGithubWebhook } from '../controllers/webhook.controller';

const router = Router();

// Endpoint mapped to: POST /api/v1/webhooks/github
router.post('/github', handleGithubWebhook);

export default router;