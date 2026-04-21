import { authController } from "../controllers/auth.controller";
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { rateLimiter } from "../middlewares/rateLimiter.middleware";
const router = Router();

router.post("/register", rateLimiter.limit({ limit: 5, windowSeconds: 60 }),(req, res) => authController.registerUser(req, res));
router.post("/login", rateLimiter.limit({ limit: 5, windowSeconds: 60 }), (req, res) => authController.login(req, res));
router.put("/change-password", rateLimiter.limit({ limit: 5, windowSeconds: 60 }), authenticate, (req, res) => authController.changePassword(req, res));
router.get("/me", authenticate, rateLimiter.limit({ limit: 5, windowSeconds: 60 }), (req, res) => authController.getMe(req, res));
router.post("/logout", authenticate, rateLimiter.limit({ limit: 5, windowSeconds: 60 }), (req, res) => authController.logoutUser(req, res));
router.post("/refresh", (req, res) => authController.refreshToken(req, res));
router.get("/githubLogin", (req,res) => authController.githubLogin(req, res));
router.get("/github/callback", (req, res) => authController.githubCallback(req, res));
export default router;

