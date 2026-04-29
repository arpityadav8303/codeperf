import { Express, Router } from "express";
import authRoutes from "./Auth.routes";
import submissionRoutes from "./submission.route";

export function setupRoutes(app: Express) {
    const apiRouter = Router();
    apiRouter.get("/health", (req, res) => {
        res.json({ success: true, message: "CodePerf API is running" });
    });

    apiRouter.use("/auth", authRoutes);
    apiRouter.use("/submission",submissionRoutes);
    app.use("/api/v1", apiRouter);
    
    console.log("API routes mounted successfully.");
}