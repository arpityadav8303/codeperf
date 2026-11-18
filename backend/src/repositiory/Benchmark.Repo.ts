import { AppDataSource } from "../data-source.postgres";
import { Benchmark } from "../models/Benchmark";

export const BenchmarkRepository = AppDataSource.getRepository(Benchmark).extend({});