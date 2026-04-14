import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { User } from "./models/User";
import { Repository } from "./models/Repository";
import { Submission } from "./models/Submission";
import { Benchmark } from "./models/Benchmark";
import { AlgorithmPattern } from "./models/AlgorithmPattern";

dotenv.config()
export const AppDataSource = new DataSource({
    type: "mysql",
    host:process.env.DB_HOST,
    port:3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Auto-creates/updates tables based on your Entities
    logging: true,     // Log SQL queries to console
    entities: [User, Repository, Submission, Benchmark, AlgorithmPattern],
    subscribers: [],
    migrations: [],
});