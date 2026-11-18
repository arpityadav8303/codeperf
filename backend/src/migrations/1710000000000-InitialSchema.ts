import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class InitialSchema1710000000000 implements MigrationInterface {
    name = "InitialSchema1710000000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    { name: "id", type: "varchar", length: "36", isPrimary: true },
                    { name: "name", type: "varchar", isNullable: true },
                    { name: "email", type: "varchar", isNullable: true, isUnique: true },
                    { name: "passwordHash", type: "varchar", isNullable: false },
                    { name: "githubId", type: "varchar", isNullable: true, isUnique: true },
                    { name: "githubUsername", type: "varchar", isNullable: true },
                    { name: "avatarUrl", type: "varchar", isNullable: true },
                    { name: "createdAt", type: "datetime", precision: 6, default: "CURRENT_TIMESTAMP(6)" }
                ]
            })
        );

        await queryRunner.createIndex(
            "users",
            new TableIndex({
                name: "IDX_users_githubId",
                columnNames: ["githubId"]
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "repositories",
                columns: [
                    { name: "id", type: "varchar", length: "36", isPrimary: true },
                    { name: "githubRepoId", type: "varchar", isNullable: false },
                    { name: "fullName", type: "varchar", isNullable: false },
                    { name: "webhookSecret", type: "varchar", isNullable: false },
                    { name: "blockOnRegression", type: "tinyint", isNullable: false, default: 0 },
                    { name: "regressionThresholdX", type: "float", isNullable: false, default: 2 },
                    { name: "createdAt", type: "datetime", precision: 6, default: "CURRENT_TIMESTAMP(6)" },
                    { name: "userId", type: "varchar", length: "36", isNullable: false }
                ]
            })
        );

        await queryRunner.createIndex(
            "repositories",
            new TableIndex({
                name: "IDX_repositories_githubRepoId",
                columnNames: ["githubRepoId"]
            })
        );

        await queryRunner.createIndex(
            "repositories",
            new TableIndex({
                name: "IDX_repositories_githubRepoId_userId",
                columnNames: ["githubRepoId", "userId"],
                isUnique: true
            })
        );

        await queryRunner.createForeignKey(
            "repositories",
            new TableForeignKey({
                name: "FK_repositories_userId",
                columnNames: ["userId"],
                referencedTableName: "users",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE"
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "submissions",
                columns: [
                    { name: "id", type: "varchar", length: "36", isPrimary: true },
                    { name: "code", type: "text", isNullable: false },
                    { name: "language", type: "varchar", isNullable: false },
                    { name: "status", type: "enum", enum: ["queued", "running", "completed", "failed"], default: "'queued'" },
                    { name: "detectedComplexity", type: "varchar", isNullable: true },
                    { name: "confidence", type: "float", isNullable: true },
                    { name: "createdAt", type: "datetime", precision: 6, default: "CURRENT_TIMESTAMP(6)" },
                    { name: "userId", type: "varchar", length: "36", isNullable: false }
                ]
            })
        );

        await queryRunner.createForeignKey(
            "submissions",
            new TableForeignKey({
                name: "FK_submissions_userId",
                columnNames: ["userId"],
                referencedTableName: "users",
                referencedColumnNames: ["id"]
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "benchmark",
                columns: [
                    { name: "id", type: "varchar", length: "36", isPrimary: true },
                    { name: "inputSize", type: "int", isNullable: false },
                    { name: "executionTimeMs", type: "float", isNullable: false },
                    { name: "memoryUsedKb", type: "float", isNullable: false },
                    { name: "submissionId", type: "varchar", length: "36", isNullable: false }
                ]
            })
        );

        await queryRunner.createForeignKey(
            "benchmark",
            new TableForeignKey({
                name: "FK_benchmark_submissionId",
                columnNames: ["submissionId"],
                referencedTableName: "submissions",
                referencedColumnNames: ["id"]
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "algorithm_patterns",
                columns: [
                    { name: "id", type: "varchar", length: "36", isPrimary: true },
                    { name: "name", type: "varchar", isNullable: false },
                    { name: "description", type: "text", isNullable: false },
                    { name: "complexity", type: "varchar", isNullable: false }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("algorithm_patterns");
        await queryRunner.dropTable("benchmark", true, true, true);
        await queryRunner.dropTable("submissions", true, true, true);
        await queryRunner.dropTable("repositories", true, true, true);
        await queryRunner.dropTable("users", true, true, true);
    }
}
