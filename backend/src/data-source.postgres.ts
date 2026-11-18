import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

import { User } from "./models/User";
import { GitRepository } from "./models/Repository";
import { Submission } from "./models/Submission";
import { Benchmark } from "./models/Benchmark";
import { AlgorithmPattern } from "./models/AlgorithmPattern";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,

  entities: [
    User,
    GitRepository,
    Submission,
    Benchmark,
    AlgorithmPattern,
  ],

  migrations: ["src/migrations-postgres/*.ts"],
  synchronize: false,
  logging: true,
});