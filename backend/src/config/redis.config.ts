import { ConnectionOptions } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

export const redisConnectionOptions: ConnectionOptions = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD, // Matches your compose file
    maxRetriesPerRequest: null, // Critical requirement: BullMQ demands this to be explicitly null
};