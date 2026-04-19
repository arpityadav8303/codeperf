import { Request, Response } from "express";
import { UserService } from "../services/auth.services";
import { generateAccessToken, generateRefreshToken } from "../utils/auth";
import bcrypt from 'bcrypt';
import { verifyRefreshToken } from "../utils/auth";
import { success } from "zod";
export class UserAuth {
    constructor(private userService = new UserService()) { }

    async registerUser(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            const user = await this.userService.register({
                name,
                email,
                password
            });
            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: user,
                accessToken,
                refreshToken
            });

        } catch (error: any) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password required"
                })
            }

            const user = await this.userService.findOne({
                where: { email },
                select: ["id", "name", "email", "passwordHash"]
            });


            if (!user || !user.passwordHash) {
                return res.status(400).json({
                    success: false,
                    message: "User account is invalid (missing password hash). Please re-register."
                });
            }

            const passwordMatch = await bcrypt.compare(password, user.passwordHash);


            if (!passwordMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid password"
                });
            }

            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);

            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                accessToken,
                refreshToken
            });

        }
        catch (error: any) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async changePassword(req: Request, res: Response) {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = req.user.id;
            const user = await this.userService.findOne({
                where: { id: userId },
                select: ["id", "passwordHash", "name", "email"]
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }

            const passwordMatch = await bcrypt.compare(oldPassword, user.passwordHash);
            if (!passwordMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid old password"
                })
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.passwordHash = hashedPassword;
            await this.userService.update(userId, user);
            return res.status(200).json({
                success: true,
                message: "Password changed successfully"
            });

        } catch (error: any) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async logoutUser(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const user = await this.userService.findOne({ where: { id: userId } })
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }
            return res.status(200).json({
                success: true,
                message: "Logout successful"
            });
        } catch (error: any) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async getMe(req: Request, res: Response) {
        try {
            const userId = req.user.id;
            const user = await this.userService.findOne({
                where: { id: userId },
                select: ["id", "name", "email"]
            });

            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            return res.status(200).json({
                success: true,
                data: user
            });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    
    async refreshToken(req: Request, res: Response) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ success: false, message: "Refresh token required" });
        }

        const decoded = verifyRefreshToken(refreshToken) as any; 
        
        const accessToken = generateAccessToken(decoded.userId);
        const newRefreshToken = generateRefreshToken(decoded.userId);

        return res.status(200).json({
            success: true,
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (error: any) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired refresh token"
        });
    }
}
}

export const authController = new UserAuth();