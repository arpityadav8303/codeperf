import { ConnectionOptions } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redisConnectionOptions: ConnectionOptions = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD, // Matches your compose file
    maxRetriesPerRequest: null, // Critical requirement: BullMQ demands this to be explicitly null
};

// Create the Redis client instance for caching and general Redis interactions
export const redisClient = new Redis({
    host: redisConnectionOptions.host,
    port: redisConnectionOptions.port,
    password: redisConnectionOptions.password,
});