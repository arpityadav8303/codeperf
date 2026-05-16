import { Router } from "express";
import { RepoController } from "../controllers/repository.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();
const repoController = new RepoController();

router.get("/getAllRepo", authenticate, (req, res) => repoController.getAllRepo(req, res));
router.post("/connectRepo", authenticate, (req, res) => repoController.connectRepo(req, res));
router.get("/:id/get-allFunctions", authenticate, (req,res)=> repoController.repofunction(req,res));
router.put("/:id/update-config", authenticate, (req,res)=> repoController.updateConfig(req,res));
router.put("/:id/update-status", authenticate, (req,res)=> repoController.updateRepoStatus(req,res));
export default router;
