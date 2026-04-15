import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateAccessToken = (userId: string | number): string => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "15m" });
}

export const generateRefreshToken = (userId: string | number): string => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" });
}

export const verifyAccessToken = (token: string): string | jwt.JwtPayload => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
}

export const verifyRefreshToken = (token: string): string | jwt.JwtPayload => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
}
