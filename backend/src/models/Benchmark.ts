import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Submission } from "./Submission";

@Entity("benchmark")
export class Benchmark {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    inputSize!: number;

    @Column("float")
    executionTimeMs!: number;

    @Column("float")
    memoryUsedKb!: number;

    @ManyToOne(() => Submission, (submission) => submission.benchmarks)
    submission!: Submission;
}