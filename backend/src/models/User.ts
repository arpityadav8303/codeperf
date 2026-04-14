import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Submission } from "./Submission";
import { Repository } from "./Repository";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("varchar", { unique: true, nullable: true })
    email!: string | null;

    @Column("varchar", { nullable: true, select: false })
    passwordHash!: string | null;

    @Column("varchar", { unique: true, nullable: true })
    githubId!: string | null;

    @CreateDateColumn()
    createdAt!: Date;

    @OneToMany(() => Submission, (submission: Submission) => submission.user)
    submissions!: Submission[];

    @OneToMany(() => Repository, (repo: Repository) => repo.user)
    repositories!: Repository[];
}
