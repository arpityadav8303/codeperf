import { authController } from "../controllers/auth.controller";
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { rateLimiter } from "../middlewares/rateLimiter.middleware";
const router = Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User registered
 */
router.post("/register", rateLimiter.limit({ limit: 5, windowSeconds: 60 }),(req, res) => authController.registerUser(req, res));
/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Logged in
 */
router.post("/login", rateLimiter.limit({ limit: 5, windowSeconds: 60 }), (req, res) => authController.login(req, res));
router.put("/change-password", rateLimiter.limit({ limit: 5, windowSeconds: 60 }), authenticate, (req, res) => authController.changePassword(req, res));
/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Current user info
 */
router.get("/me", authenticate, rateLimiter.limit({ limit: 5, windowSeconds: 60 }), (req, res) => authController.getMe(req, res));
router.post("/logout", authenticate, rateLimiter.limit({ limit: 5, windowSeconds: 60 }), (req, res) => authController.logoutUser(req, res));
router.post("/refresh", (req, res) => authController.refreshToken(req, res));
router.get("/github", (req,res) => authController.githubLogin(req, res));
router.get("/github/callback", (req, res) => authController.githubCallback(req, res));
router.post("/send-otp",rateLimiter.limit({ limit: 5, windowSeconds: 60 }),(req,res)=>authController.sendOtp(req,res));
router.post("/verify-otp",rateLimiter.limit({ limit: 5, windowSeconds: 60 }),(req,res)=>authController.verifyOtp(req,res));
router.post("/reset-password",rateLimiter.limit({ limit: 5, windowSeconds: 60 }), (req,res)=>authController.forgotPassword(req,res))
export default router;

