import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/auth";
import jwt from "jsonwebtoken";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token required"
            });
        }

        const decoded = verifyAccessToken(token) as jwt.JwtPayload;
        
        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        // Attach user info to request
        req.user = {
            id: decoded.userId
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
};
