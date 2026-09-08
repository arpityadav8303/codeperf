import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { User } from "./models/User";
import { GitRepository } from "./models/Repository";
import { Submission } from "./models/Submission";
import { Benchmark } from "./models/Benchmark";
import { AlgorithmPattern } from "./models/AlgorithmPattern";
import { InitialSchema1710000000000 } from "./migrations/1710000000000-InitialSchema";
import { AddIsActiveToRepositories1715800000000 } from "./migration";
import { AddRepositoryIdToSubmissions1780000000000 } from "./migrations/1780000000000-AddRepositoryIdToSubmissions";
import { AddIsChangePassToUsers1781000000000 } from "./migrations/1781000000000-AddIsChangePassToUsers";

dotenv.config()
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    entities: [User, GitRepository, Submission, Benchmark, AlgorithmPattern],
    subscribers: [],
    migrations: [
        InitialSchema1710000000000,
        AddIsActiveToRepositories1715800000000,
        AddRepositoryIdToSubmissions1780000000000,
        AddIsChangePassToUsers1781000000000
    ],
});
