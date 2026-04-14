"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("./models/User");
const Repository_1 = require("./models/Repository");
const Submission_1 = require("./models/Submission");
const Benchmark_1 = require("./models/Benchmark");
const AlgorithmPattern_1 = require("./models/AlgorithmPattern");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Auto-creates/updates tables based on your Entities
    logging: true, // Log SQL queries to console
    entities: [User_1.User, Repository_1.Repository, Submission_1.Submission, Benchmark_1.Benchmark, AlgorithmPattern_1.AlgorithmPattern],
    subscribers: [],
    migrations: [],
});
//# sourceMappingURL=data-source.js.map