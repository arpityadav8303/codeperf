import express, { Express, Router } from "express";
import authRoutes from "./Auth.routes";
import submissionRoutes from "./submission.route";
import repositoryRoutes from "./repository.routes";
import dashboardRoutes from "./dashboard.routes";
import webhookRoutes from "./webhook.routes";

export function setupRoutes(app: Express) {
    const apiRouter = Router();
    apiRouter.get("/health", (req, res) => {
        res.json({ success: true, message: "CodePerf API is running" });
    });

    apiRouter.use("/auth", authRoutes);
    apiRouter.use("/submission", submissionRoutes);
    apiRouter.use("/repository", repositoryRoutes);
    apiRouter.use("/dashboard", dashboardRoutes);
    apiRouter.use("/webhook", webhookRoutes);
    app.use((req, res, next) => {
        if (req.path.startsWith("/api/v1/webhook")) {
            return next(); // Skip express.json() for webhooks
        }
        express.json()(req, res, next);
    });

    console.log("API routes mounted successfully.");
}