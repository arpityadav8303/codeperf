import { Request, Response } from "express";
import { repositioryService, WhereCondition } from "../services/Repository.services"
export class RepoController {
    constructor(
        private repoService = new repositioryService
    ) { }

    async getAllRepo(req: Request, res: Response): Promise<any> {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "ID is required" });
        }
        const select = ["githubRepoId", "fullName", "blockOnRegression", "regressionThresholdX", "createdAt"];
        const whereCondition: WhereCondition[] = [{ name: "User.id", op: "is", value: id }];
        const data = await this.repoService.list(10, 0, select, whereCondition);
        return res.status(200).json(data);
    }
}