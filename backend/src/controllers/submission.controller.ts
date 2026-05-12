import { date, success } from "zod";
import { SubmissionService } from "../services/Submission.Services";
import { Request, Response, NextFunction} from "express";
export class Submission {
    constructor(private submissionService = new SubmissionService) { }

    async getSubmission(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID is required" });
            }
            const result = await this.submissionService.findById(id);
            if (!result) {
                return res.status(404).json({ message: "Submission not found" });
            }
            return res.status(200).json({
                message: "Successfully retrieved submission",
                data: result,
            });
        } catch (error) {
            console.error("Error in getSubmission controller:", error);
            return res.status(500).json({
                message: error || "An internal server error occurred",
            });
        }
    }

    async getSubmissionWithBenchmark(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "ID is required" });
            }
            const result = await this.submissionService.findWithBenchmark(id);
            if (!result) {
                return res.status(404).json({ message: "Submission not found" });
            }
            return res.status(200).json({
                message: "Successfully retrieved submission with benchmarks",
                data: result,
            });
        } catch (error) {
            console.error("Error in getSubmissionWithBenchmark controller:", error);
            return res.status(500).json({
                message: error,
            });
        }
    }

    async createSubmission(req: Request, res: Response): Promise<any> {
        try {
            const { code, language } = req.body;
            if (!code || !language) {
                return res.status(400).json({ message: "Code and language are required" });
            }
            const userId = req.user.id;
            const result = await this.submissionService.processSubmission(code, language, userId);
            return res.status(200).json({
                message: "Successfully created submission",
                data: result,
            });

        }
        catch (error) {
            console.error("Error in createSubmission controller:", error);
            return res.status(500).json({
                message: error,
            });
        }
    }

    async getAllSubmissionsOfUser(req: Request, res: Response): Promise<any> {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const page = parseInt(req.query.page as string);
            const offset = (page - 1) * limit;
            const filters = {
                language: req.query.language as string,
                complexity: req.query.complexity as string
            };

            const { id } = req.user;

            const data = await this.submissionService.list(id, limit, offset, filters);

            return res.status(200).json({
                success: true,
                data,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: `${error}`
            });
        }
    }

    async getSubmissionReview(req: Request, res: Response, next: NextFunction)  {
    try {
        const { id } = req.params;
        const userId = req.user.id; // From auth middleware

        const reviewData = await this.submissionService.getAIReview(userId, id);

        return res.status(200).json({
            success: true,
            date: reviewData,
            message:"AI review placeholder retrieved"
        })
    } catch (error) {
        next(error); // Caught by your global error handler
    }
};
}
export default new Submission();