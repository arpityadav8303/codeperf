import { ConnectionOptions } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

/* ========================================================
   OLD LOCAL DOCKER CONNECTION OPTIONS (PRESERVED)
   ========================================================
export const redisConnectionOptions: ConnectionOptions = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD, 
    maxRetriesPerRequest: null, 
};

export const redisClient = new Redis({
    host: redisConnectionOptions.host,
    port: redisConnectionOptions.port,
    password: redisConnectionOptions.password,
});
======================================================== */


// NEW UPSTASH CLOUD CONFIGURATION USING REDIS_URL
const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error("REDIS_URL is missing in your .env file!");
}

// 1. Create the general Redis client instance using the connection string
// ioredis automatically enables TLS because the string starts with 'rediss://'
export const redisClient = new Redis(redisUrl);

// 2. Generate the BullMQ connection options dynamically from the client's parsed options
export const redisConnectionOptions: ConnectionOptions = {
    ...redisClient.options,
    maxRetriesPerRequest: null, // Preserving critical BullMQ requirement
};

// Optional: Connection log to verify everything connects smoothly
redisClient.on("connect", () => {
    console.log("CodePerf connected to Upstash Cloud Redis using URL cleanly!");
});