import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, Index } from "typeorm";
import { Submission } from "./Submission";
import { Repository } from "./Repository";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("varchar", { nullable: true })
    name!: string | null;

    @Column("varchar", { unique: true, nullable: true })
    email!: string | null;

    @Column("varchar", { select: false })
    passwordHash!: string;


    @Index()
    @Column("varchar", { unique: true, nullable: true })
    githubId!: string | null;

    @Column("varchar", { nullable: true })
    githubUsername!: string | null;

    @Column("varchar", { nullable: true })
    avatarUrl!: string | null;

    @CreateDateColumn()
    createdAt!: Date;

    @OneToMany(() => Submission, (submission: Submission) => submission.user)
    submissions!: Submission[];

    @OneToMany(() => Repository, (repo: Repository) => repo.user)
    repositories!: Repository[];
}