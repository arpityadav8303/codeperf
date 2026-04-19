import { Request, Response } from "express";
import { UserService } from "../services/auth.services";

export class UserAuth {
    constructor(private userService = new UserService()) {}

    async registerUser(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            const result = await this.userService.register({
                name,
                email,
                password
            });

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: result
            });

        } catch (error: any) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }
}

export const authController = new UserAuth();