import { authController } from "../controllers/auth.controller";
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", (req, res) => authController.registerUser(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.post("/change-password", authenticate, (req, res) => authController.changePassword(req, res));

export default router;

