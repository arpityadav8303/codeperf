import { Request, Response, NextFunction } from 'express';

interface RateEntry {
    count: number;
    resetTime: number;
}

export class RateLimiter {
    private store = new Map<string, RateEntry>();

    constructor() {
        setInterval(() => {
            const now = Date.now();
            for (const [key, entry] of this.store.entries()) {
                if (now > entry.resetTime) {
                    this.store.delete(key);
                }
            }
        }, 5 * 60 * 1000); 
    }

    limit({ limit, windowSeconds = 0, windowMinutes = 0 }: { limit: number; windowSeconds?: number; windowMinutes?: number }) {
        const windowMs = (windowSeconds * 1000) + (windowMinutes * 60 * 1000);

        return (req: Request, res: Response, next: NextFunction) => {
            const ip = req.ip || 'unknown';
            const routeKey = req.route?.path || req.path; 
            const key = `${ip}:${routeKey}`;
            
            const now = Date.now();
            const entry = this.store.get(key);

            // Logic: If no entry OR the window has expired, reset it
            if (!entry || now > entry.resetTime) {
                this.store.set(key, { 
                    count: 1, 
                    resetTime: now + windowMs 
                });
                return next();
            }

            // If within the window, check the count
            if (entry.count >= limit) {
                const waitTime = Math.ceil((entry.resetTime - now) / 1000);
                return res.status(429).json({ 
                    error: "Too many requests", 
                    retryAfterSeconds: waitTime 
                });
            }

            // Increment count
            entry.count++;
            next();
        };
    }
}

// Export a single instance to share the memory/cleanup task
export const rateLimiter = new RateLimiter();