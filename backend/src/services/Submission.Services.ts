import { SubmissionRepository } from "../repositiory/Submission.Repo";
import { BenchmarkRepository } from "../repositiory/Benchmark.Repo";
import { Submission } from "../models/Submission";
import { Benchmark } from "../models/Benchmark";
import { AppDataSource } from "../data-source"
import { redisClient, redisConnectionOptions } from '../config/redis.config';
import { Queue } from "bullmq";

export class SubmissionService {
    private analysisQueue = new Queue("analysis queue", { connection: redisConnectionOptions });
    constructor(
        private subRepo = SubmissionRepository,
        private benchRepo = BenchmarkRepository,
    ) { }

    async processSubmission(code: string, language: string, userId: string): Promise<Submission> {
        // 2. Save a lightweight entry in MySQL marked as 'queued'
        const submissionInstance = this.subRepo.create({
            code,
            language,
            status: "queued",
            user: { id: userId } as any
        });
        const savedSubmission = await this.subRepo.save(submissionInstance);

        // 3. Kick off the background job asynchronously by adding it to Redis
        await this.analysisQueue.add("analyzeManualSubmission", {
            submissionId: savedSubmission.id,
            code,
            language,
            userId
        }, {
            attempts: 3,
            backoff: { type: "exponential", delay: 2000 }
        });

        // 4. Return immediately to the controller so the API responds in <100ms
        return savedSubmission;
    }

    async findById(id: any): Promise<any> {
        // 1. Check Redis Cache
        const cacheKey = `submission:${id}`;
        try {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                console.log(`[Cache Hit] Found data for key: ${cacheKey}`);
                return JSON.parse(cachedData) as Submission;
            }
        } catch (redisError) {
            // Defensive Logging: If Redis fails, don't crash the app; fallback to DB
            console.error(`[Redis Error] Failed to get key ${cacheKey}:`, redisError);
        }

        // 2. Cache Miss — Query MySQL Database via Repository
        console.log(`[Cache Miss] Querying database for key: ${cacheKey}`);
        const submission = await this.subRepo.findOneBy({ id });

        if (!submission) {
            return null;
        }

        // 3. Store in Cache asynchronously with a 5-minute TTL (300 seconds)
        try {
            // 'EX' stands for Expire in seconds
            await redisClient.set(cacheKey, JSON.stringify(submission), "EX", 300);
        } catch (redisError) {
            console.error(`[Redis Error] Failed to set key ${cacheKey}:`, redisError);
        }

        return submission;
    }

    async findWithBenchmark(id: any): Promise<any> {
        const result = await AppDataSource
            .getRepository(Submission)
            .createQueryBuilder("submission")
            .leftJoinAndSelect("submission.benchmarks", "benchmark")
            .where("submission.id = :id", { id })
            .getOne();

        return result;
    }
    async list(userId: string, limit: number, offset: number, filters?: { language?: string; complexity?: string }) {
        const { results, total } = await this.subRepo.findAllByUser(userId, limit, offset, filters);
        console.log(limit, '=====limit');
        const totalPages = Math.ceil(total / limit);
        return {
            success: true,
            data: results,
            total,
            offset,
            totalPages,
            message: "Submission history retrieved successfully"
        };
    }

    async getAIReview(userId: string, submissionId: any) {
        // 1. Verify submission exists and belongs to the user
        const submission = await this.subRepo.findOne({
            where: { id: submissionId }
        });

        if (!submission) {
            throw new Error("Submission not found or unauthorized");
        }

        // 2. Return structured placeholder
        // This structure remains the same when real AI is added in Phase 4
        return {
            submissionId: submission.id,
            review: "AI review coming in Phase 4", // Grounded review will go here
            suggestedFix: null, // Refactored code snippet will go here
            status: "placeholder",
            generatedAt: new Date()
        };
    }
}