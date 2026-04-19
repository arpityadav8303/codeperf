import { Express } from "express";
import authRoutes from "./Auth.routes";

export function AuthRoutes(app: Express) {
  app.use("/register", authRoutes);

  app.get("/health", (req, res) => {
    res.json({ success: true, message: "CodePerf API is running" });
  });
}
