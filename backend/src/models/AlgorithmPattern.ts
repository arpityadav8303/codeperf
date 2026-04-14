import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("algorithm_patterns")
export class AlgorithmPattern {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column("text")
    description!: string;

    @Column()
    complexity!: string;
}