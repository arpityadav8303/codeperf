import { Express, Router } from "express";
import authRoutes from "./Auth.routes";

export function registerRoutes(app: Express) {
    const apiRouter = Router();
    apiRouter.get("/health", (req, res) => {
        res.json({ success: true, message: "CodePerf API is running" });
    });

    apiRouter.use("/auth", authRoutes);

    app.use("/api/v1", apiRouter);
    
    console.log("API routes mounted successfully.");
}