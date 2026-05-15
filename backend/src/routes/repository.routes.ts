import { Router } from "express";
import { RepoController } from "../controllers/repository.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const repoController = new RepoController();

router.get("/", authenticate, (req, res) => repoController.getAllRepo(req, res));
router.post("/connect", authenticate, (req, res) => repoController.connectRepo(req, res));

export default router;
