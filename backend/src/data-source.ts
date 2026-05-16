import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { User } from "./models/User";
import { GitRepository } from "./models/Repository";
import { Submission } from "./models/Submission";
import { Benchmark } from "./models/Benchmark";
import { AlgorithmPattern } from "./models/AlgorithmPattern";
import { AddIsActiveToRepositories1715800000000 } from "./migration";

dotenv.config()
export const AppDataSource = new DataSource({
    type: "mysql",
    host:process.env.DB_HOST,
    port:3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false, // Auto-creates/updates tables based on your Entities
    logging: true,     // Log SQL queries to console
    entities: [User, GitRepository, Submission, Benchmark, AlgorithmPattern],
    subscribers: [],
    migrations: [AddIsActiveToRepositories1715800000000],
});