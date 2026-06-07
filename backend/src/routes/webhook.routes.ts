import { Router, Request, Response, NextFunction } from "express";
import { webhookController } from "../controllers/webhook.controller";

const router = Router();

// Raw body capture middleware — ONLY for webhook route
// express.json() already runs globally, so we need this BEFORE that
// Solution: capture rawBody in a custom middleware
router.post("/github", (req: Request, res: Response, next: NextFunction) => {
        let data = Buffer.alloc(0);
        req.on("data", (chunk: Buffer) => {
            data = Buffer.concat([data, chunk]);
        });
        req.on("end", () => {
            (req as any).rawBody = data;
            // Manually parse JSON since express.json() already consumed the stream
            try {
                req.body = JSON.parse(data.toString());
            } catch {
                req.body = {};
            }
            next();
        });
    },
    (req, res) => webhookController.handleGithubWebhook(req, res)
);

export default router;