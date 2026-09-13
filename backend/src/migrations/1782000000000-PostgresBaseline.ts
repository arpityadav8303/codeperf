import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class PostgresBaseline1782000000000 implements MigrationInterface {
    name = "PostgresBaseline1782000000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid" },
                    { name: "name", type: "varchar", isNullable: true },
                    { name: "email", type: "varchar", isNullable: true, isUnique: true },
                    { name: "passwordHash", type: "varchar" },
                    { name: "githubId", type: "varchar", isNullable: true, isUnique: true },
                    { name: "githubUsername", type: "varchar", isNullable: true },
                    { name: "avatarUrl", type: "varchar", isNullable: true },
                    { name: "isChangePass", type: "boolean", default: false },
                    { name: "createdAt", type: "timestamp", precision: 6, default: "CURRENT_TIMESTAMP(6)" }
                ]
            })
        );

        await queryRunner.createIndex(
            "users",
            new TableIndex({ name: "IDX_users_githubId", columnNames: ["githubId"] })
        );

        await queryRunner.createTable(
            new Table({
                name: "repositories",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid" },
                    { name: "githubRepoId", type: "varchar" },
                    { name: "fullName", type: "varchar" },
                    { name: "webhookSecret", type: "varchar" },
                    { name: "blockOnRegression", type: "boolean", default: false },
                    { name: "regressionThresholdX", type: "float", default: 2 },
                    { name: "isActive", type: "boolean", default: true },
                    { name: "createdAt", type: "timestamp", precision: 6, default: "CURRENT_TIMESTAMP(6)" },
                    { name: "userId", type: "uuid" }
                ]
            })
        );

        await queryRunner.createIndex(
            "repositories",
            new TableIndex({ name: "IDX_repositories_githubRepoId", columnNames: ["githubRepoId"] })
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
                    { name: "id", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid" },
                    { name: "code", type: "text" },
                    { name: "language", type: "varchar" },
                    {
                        name: "status",
                        type: "enum",
                        enumName: "submissions_status_enum",
                        enum: ["queued", "running", "completed", "failed"],
                        default: "'queued'"
                    },
                    { name: "detectedComplexity", type: "varchar", isNullable: true },
                    { name: "confidence", type: "float", isNullable: true },
                    { name: "createdAt", type: "timestamp", precision: 6, default: "CURRENT_TIMESTAMP(6)" },
                    { name: "userId", type: "uuid" },
                    { name: "repositoryId", type: "uuid", isNullable: true }
                ]
            })
        );
        await queryRunner.createIndex(
            "submissions",
            new TableIndex({ name: "IDX_submissions_repositoryId", columnNames: ["repositoryId"] })
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
        await queryRunner.createForeignKey(
            "submissions",
            new TableForeignKey({
                name: "FK_submissions_repositoryId",
                columnNames: ["repositoryId"],
                referencedTableName: "repositories",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE"
            })
        );

        await queryRunner.createTable(
            new Table({
                name: "benchmark",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid" },
                    { name: "inputSize", type: "int" },
                    { name: "executionTimeMs", type: "float" },
                    { name: "memoryUsedKb", type: "float" },
                    { name: "submissionId", type: "uuid" }
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
                    { name: "id", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid" },
                    { name: "name", type: "varchar" },
                    { name: "description", type: "text" },
                    { name: "complexity", type: "varchar" }
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
        await queryRunner.query('DROP TYPE IF EXISTS "submissions_status_enum"');
    }
}
