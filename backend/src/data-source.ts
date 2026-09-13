import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { User } from "./models/User";
import { GitRepository } from "./models/Repository";
import { Submission } from "./models/Submission";
import { Benchmark } from "./models/Benchmark";
import { AlgorithmPattern } from "./models/AlgorithmPattern";
import { PostgresBaseline1782000000000 } from "./migrations/1782000000000-PostgresBaseline";

dotenv.config()
export const AppDataSource = new DataSource({
    type: "postgres",
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
        PostgresBaseline1782000000000
    ],
});
