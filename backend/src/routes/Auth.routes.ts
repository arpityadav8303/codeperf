import { authController } from "../controllers/auth.controller";
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", (req, res) => authController.registerUser(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.post("/change-password", authenticate, (req, res) => authController.changePassword(req, res));
router.get("/me", authenticate, (req, res) => authController.getMe(req, res));
router.post("/logout", authenticate, (req, res) => authController.logoutUser(req, res));
router.post("/refresh", (req, res) => authController.refreshToken(req, res));
export default router;

