import { Request, Response } from "express";
import { UserService } from "../services/auth.services";
import { generateAccessToken, generateRefreshToken } from "../utils/auth";
import bcrypt from 'bcrypt';
import { verifyRefreshToken, generateOTP } from "../utils/auth";
import { getGithubAccessToken, getGithubPrimaryEmail, getGithubUserProfile } from "../utils/github";
import { sendMail } from "../utils/mailSender";
import { redisClient } from "../config/redis.config";
import { randomBytes } from "crypto";

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

    async githubLogin(req: Request, res: Response) {
        const clientId = process.env.GITHUB_CLIENT_ID;
        const redirectUri = process.env.GITHUB_REDIRECT_URI;

        if (!clientId || !redirectUri) {
            return res.status(500).json({
                success: false,
                message: "GitHub OAuth is not configured on the server"
            });
        }

        const rootURL = "https://github.com/login/oauth/authorize";
        const options = {
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: "read:user user:email",
            state: "some_random_string",
        };
        const queryString = new URLSearchParams(options).toString();
        return res.redirect(`${rootURL}?${queryString}`);
    }
    async githubCallback(req: Request, res: Response) {
        try {
            const { code } = req.query;
            if (!code || typeof code !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Authorization code not provided"
                });
            }

            const accessToken = await getGithubAccessToken(code);
            const githubUser = await getGithubUserProfile(accessToken);
            const email = githubUser.email || await getGithubPrimaryEmail(accessToken);

            const user = await this.userService.findOrCreateGithubUser({
                githubId: String(githubUser.id),
                githubUsername: githubUser.login,
                name: githubUser.name || githubUser.login,
                email,
                avatarUrl: githubUser.avatar_url
            });

            const appAccessToken = generateAccessToken(user.id);
            const appRefreshToken = generateRefreshToken(user.id);
            const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
            return res.redirect(`${frontendUrl}/login-success?accessToken=${appAccessToken}&refreshToken=${appRefreshToken}`);
        } catch (error: any) {
            console.error("GitHub OAuth callback failed:", error?.message || error);
            return res.status(500).json({
                success: false,
                message: "GitHub OAuth failed"
            });
        }
    }

    async sendOtp(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "Email required"
                })
            }
            const user = await this.userService.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "User not found"
                })
            }
            const otp = generateOTP();
            const saltRounds = 10;
            const hashedOTP = await bcrypt.hash(String(otp), saltRounds);
            const saveRedis = await this.userService.otpSave(email, hashedOTP);
            if (!saveRedis) {
                return res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                })
            }
            const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
        <h2 style="color: #333;">OTP Verification</h2>
        <p>Hello,</p>
        <p>Your One-Time Password (OTP) is:</p>
        <h1 style="color: #2e86de; letter-spacing: 2px;">${otp}</h1>
        <p>This code will expire in <strong>5 minutes</strong>. Please do not share it with anyone.</p>
        <hr />
        <p style="font-size: 12px; color: #777;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    `
            await sendMail(email, "Your Otp", html);
            return res.status(200).json({
                success: true,
                message: "Otp send successfully on your registered email"
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "error occured"
            })
        }
    }

    async verifyOtp(req: Request, res: Response): Promise<any> {
        try {
            const { otp, email } = req.body;
            if (!otp || !email) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide otp and email"
                });
            }
            const otpHashed = await this.userService.getOtp(email);
            if (!otpHashed) {
                return res.status(410).json({
                    success: false,
                    message: "Otp expired or not found"
                });
            }
            const compare = await bcrypt.compare(otp, otpHashed);
            if (!compare) {
                return res.status(400).json({
                    success: false,
                    message: "Otp not matched"
                });
            }

            const normalizedEmail = email.toLowerCase().trim();
            const user = await this.userService.findOne({
                where: { email: normalizedEmail },
                select: ["id", "email"]
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
            const resetToken = randomBytes(32).toString("hex");
            await redisClient.set(`reset:${resetToken}`, normalizedEmail, "EX", 300);

            return res.status(200).json({
                success: true,
                data: resetToken,
                message: "Otp matched"
            });

        } catch (error: any) {
            return res.status(error.status || 500).json({
                success: false,
                message: error.message || "Internal Server Error"
            });
        }
    }

    async forgotPassword(req: Request, res: Response): Promise<any> {
        try {
            const { password, resetToken } = req.body;
            if (!password || !resetToken) {
                return res.status(400).json({
                    success: false,
                    message: "Password and reset token are required"
                });
            }
            const email = await redisClient.get(`reset:${resetToken}`);
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "Reset token expired or invalid. Please verify OTP first."
                });
            }
            const userData = await this.userService.findOne({ where: { email: email } });
            if (!userData) {
                return res.status(404).json({
                    success: false,
                    message: "User account no longer exists"
                });
            }
            userData.passwordHash = await bcrypt.hash(password, 10);
            await this.userService.update(userData.id, userData);
            await redisClient.del(`reset:${resetToken}`);
            return res.status(200).json({
                success: true,
                message: "Password changed successfully"
            });

        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message || "Internal server error"
            });
        }
    }

}

export const authController = new UserAuth();


