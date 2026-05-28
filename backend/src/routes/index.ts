import { Express, Router } from "express";
import authRoutes from "./Auth.routes";
import submissionRoutes from "./submission.route";
import repositoryRoutes from "./repository.routes";
import dashboardRoutes from "./dashboard.routes";  // ← add this

export function setupRoutes(app: Express) {
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