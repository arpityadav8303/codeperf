import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, CreateDateColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Submission } from "./Submission";
@Entity("repositories")
@Index(["githubRepoId", "user"], { unique: true })
export class GitRepository {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    @Index()
    githubRepoId!: string;

    @Column()
    fullName!: string;

    @Column({ select: false })
    webhookSecret!: string;

    @Column({ default: false })
    blockOnRegression!: boolean;

    @Column("float", { default: 2.0 })
    regressionThresholdX!: number;

    @Column({ default: true })
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User, (user: User) => user.repositories, {
        nullable: false,
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "userId" })
    user!: User;

    @OneToMany(() => Submission, (submission) => submission.repository)
    submissions!: Submission[];
}