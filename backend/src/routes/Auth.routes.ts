import { authController } from "../controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/register", (req, res) => authController.registerUser(req, res));
router.post("/login", (req, res) => authController.login(req, res));
export default router;

