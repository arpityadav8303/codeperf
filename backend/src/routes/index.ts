import express, { Express, Router } from "express";
import authRoutes from "./Auth.routes";
import submissionRoutes from "./submission.route";
import repositoryRoutes from "./repository.routes";
import dashboardRoutes from "./dashboard.routes";
import webhookRoutes from "./webhook.routes";

export function setupRoutes(app: Express) {
    // STEP 1: Webhook raw body capture — express.json() se PEHLE
    // Kyunki express.json() stream consume kar leta hai,
    // webhook route ko raw Buffer chahiye HMAC verification ke liye
    app.use("/api/v1/webhook", webhookRoutes);

    // STEP 2: Baaki sabhi routes ke liye JSON parsing
    // Webhook path skip ho jayega kyunki uska route already handle ho gaya upar
    app.use(express.json());

    // STEP 3: Remaining routes under /api/v1
    const apiRouter = Router();

    apiRouter.get("/health", (req, res) => {
        res.json({ success: true, message: "CodePerf API is running" });
    });

    apiRouter.use("/auth", authRoutes);
    apiRouter.use("/submission", submissionRoutes);
    apiRouter.use("/repository", repositoryRoutes);
    apiRouter.use("/dashboard", dashboardRoutes);

    app.use("/api/v1", apiRouter);

    console.log("API routes mounted successfully.");
}