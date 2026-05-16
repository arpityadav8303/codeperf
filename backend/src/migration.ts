import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveToRepositories1715800000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // This command runs when you deploy
        await queryRunner.query(
            `ALTER TABLE \`repositories\` ADD \`isActive\` tinyint NOT NULL DEFAULT 1`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // This command runs if you need to rollback/undo
        await queryRunner.query(
            `ALTER TABLE \`repositories\` DROP COLUMN \`isActive\``
        );
    }
}