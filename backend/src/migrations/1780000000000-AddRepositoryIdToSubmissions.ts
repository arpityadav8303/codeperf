import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from "typeorm";

export class AddRepositoryIdToSubmissions1780000000000 implements MigrationInterface {
    name = "AddRepositoryIdToSubmissions1780000000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasRepositoryId = await queryRunner.hasColumn("submissions", "repositoryId");

        if (!hasRepositoryId) {
            await queryRunner.addColumn(
                "submissions",
                new TableColumn({
                    name: "repositoryId",
                    type: "varchar",
                    length: "36",
                    isNullable: true
                })
            );
        }

        const table = await queryRunner.getTable("submissions");
        const hasIndex = table?.indices.some((index) => index.name === "IDX_submissions_repositoryId") ?? false;
        const hasForeignKey = table?.foreignKeys.some((fk) => fk.name === "FK_submissions_repositoryId") ?? false;

        if (!hasIndex) {
            await queryRunner.createIndex(
                "submissions",
                new TableIndex({
                    name: "IDX_submissions_repositoryId",
                    columnNames: ["repositoryId"]
                })
            );
        }

        if (!hasForeignKey) {
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
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("submissions");
        const foreignKey = table?.foreignKeys.find((fk) => fk.name === "FK_submissions_repositoryId");
        const index = table?.indices.find((idx) => idx.name === "IDX_submissions_repositoryId");

        if (foreignKey) {
            await queryRunner.dropForeignKey("submissions", foreignKey);
        }

        if (index) {
            await queryRunner.dropIndex("submissions", index);
        }

        const hasRepositoryId = await queryRunner.hasColumn("submissions", "repositoryId");
        if (hasRepositoryId) {
            await queryRunner.dropColumn("submissions", "repositoryId");
        }
    }
}
