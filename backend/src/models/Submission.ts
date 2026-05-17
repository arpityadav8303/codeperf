import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, Repository } from "typeorm";
import { User } from "./User";
import { Benchmark } from "./Benchmark";
import { GitRepository } from "./Repository";
@Entity("submissions")
export class Submission {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("text")
    code!: string;

    @Column()
    language!: string;

    @Column({ type: "enum", enum: ["queued", "running", "completed", "failed"], default: "queued" })
    status!: string;

    @Column("varchar", { nullable: true })
    detectedComplexity!: string | null;

    @Column("float", { nullable: true })
    confidence!: number | null;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User, (user: User) => user.submissions)
    user!: User;

    @OneToMany(() => Benchmark, (result: Benchmark) => result.submission)
    benchmarks!: Benchmark[];
    @ManyToOne(() => GitRepository, (repo) => repo.submissions, {
        nullable: true, // Set to true if you still want standalone code submissions
        onDelete: "CASCADE"
    })
    repository!: GitRepository;
}
