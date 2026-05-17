import { Request, Response } from "express";
import { repositioryService, WhereCondition } from "../services/Repository.services"
import { z } from "zod";

const updateConfigSchema = z.object({
    blockOnRegression: z.boolean({
        message: "blockOnRegression must be a boolean value"
    }).optional(),
    regressionThresholdX: z.number({
        message: "regressionThresholdX must be a number",
    }).positive("Threshold multiplier must be greater than 0").optional(),
}).refine(data => data.blockOnRegression !== undefined || data.regressionThresholdX !== undefined, {
    message: "At least one configuration field (blockOnRegression or regressionThresholdX) must be provided",
});

const updatedStatusSchema = z.object({
   isActive: z.preprocess((val: any) => {
        if (typeof val === 'object' && val !== null && 'status' in val) {
            val = val.status;
        }

        if (val === true || val === "true" || val === 1 || val === "1") {
            return true;
        }
        
        if (val === 0 || val === "0") {
            return false;
        }

        return val;
    }, z.boolean({
        message: "isActive must be 1 to activate or 0 to deactivate"
    }))
})

export class RepoController {
    constructor(
        private repoService = new repositioryService
    ) { }

    async getAllRepo(req: Request, res: Response): Promise<any> {
        const id = req.user?.id;
        if (!id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const select = ["githubRepoId", "fullName", "blockOnRegression", "regressionThresholdX", "createdAt", "isActive"];
        const whereCondition: WhereCondition[] = [{ name: "userId", op: "is", value: id }, {name: "isActive", op: "is", value: "1"}];
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

    public async repofunction(req: Request, res: Response): Promise<any> {
        const { id } = req.params;

        const userId = req.user.id;

        const functionResult = await this.repoService.verifyOwnership(id, userId);

        return res.status(200).json({
            data: functionResult,
            message: "Get Function successfully"
        });
    }

    public async updateConfig(req: Request, res: Response): Promise<any> {
        try {
            const validationResult = updateConfigSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationResult.error.issues.map(err => err.message)
                });
            }
            const githubRepoId = req.params.id;
            const authUserId = req.user.id;
            const dto = validationResult.data;
            const result = await this.repoService.updateData(githubRepoId, authUserId, dto);
            if (result && result.affected === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Configuration update failed. Repository not found or unauthorized access."
                });
            }
            return res.status(200).json({
                success: true,
                message: "Repository configurations saved and synced successfully",
                data: {
                    githubRepoId,
                    blockOnRegression: dto.blockOnRegression,
                    regressionThresholdX: dto.regressionThresholdX
                }
            });

        } catch (error: any) {
            console.error("Error encountered within updateConfig controller:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error occurred while updating repository configs"
            });
        }
    }

    public async updateRepoStatus(req: Request, res: Response): Promise<any> {
        try {
            const validationResult = updatedStatusSchema.safeParse(req.body);

            if (!validationResult.success) {
                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: validationResult.error.issues.map(issue => issue.message)
                });
            }
            
            const { isActive } = validationResult.data;
            const githubRepoId = req.params.id;
            const authUserId = req.user.id;
            const updatedStatus = await this.repoService.updateDataStatus(githubRepoId, authUserId, isActive);

            if (updatedStatus && updatedStatus.affected === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Status update failed. Repository not found or unauthorized access."
                });
            }
            return res.status(200).json({
                success: true,
                message: "Repo status updated successfully",
                data: {
                    githubRepoId,
                    isActive
                }
            });
        } catch (error: any) {
            console.error("Error encountered while updating status:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error occurred while updating repository configs"
            });
        }
    }
}
