import { AppDataSource } from "../data-source";
import { Benchmark } from "../models/Benchmark";

export const BenchmarkRepository = AppDataSource.getRepository(Benchmark).extend({});