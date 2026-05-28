import { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.services";

export class DashboardController {
    constructor(private dashService = new dashboardService()) { }

    public async getStats(req: Request, res: Response): Promise<any> {
        try {
            const userId = req.user.id;
            const stats = await this.dashService.getStats(userId);

            return res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error: any) {
            console.error("Error in DashboardController.getStats:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }
}

export const dashboardController = new DashboardController();
