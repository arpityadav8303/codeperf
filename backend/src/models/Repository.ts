import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity("repositories")
export class Repository {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    githubRepoId!: string;

    @Column()
    fullName!: string;

    @Column({ select: false })
    webhookSecret!: string;

    @Column({ default: false })
    blockOnRegression!: boolean;

    @Column("float", { default: 2.0 })
    regressionThresholdX!: number;

    @ManyToOne(() => User, (user: User) => user.repositories, { nullable: false })
    @JoinColumn({ name: "userId" })
    user!: User;
}
