import { Request, Response } from "express";
import { repositioryService, WhereCondition } from "../services/Repository.services"
export class RepoController {
    constructor(
        private repoService = new repositioryService
    ) { }

    async getAllRepo(req: Request, res: Response): Promise<any> {
        const id = req.user?.id;
        if (!id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const select = ["githubRepoId", "fullName", "blockOnRegression", "regressionThresholdX", "createdAt"];
        const whereCondition: WhereCondition[] = [{ name: "userId", op: "is", value: id }];
        const data = await this.repoService.list(10, 0, select, whereCondition, [], [], []);
        return res.status(200).json(data);
    }

    async connectRepo(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const data = await this.repoService.connect(userId, req.body);
            res.status(201).json({ success: true, data });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}
