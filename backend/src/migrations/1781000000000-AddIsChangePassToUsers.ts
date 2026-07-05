import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsChangePassToUsers1781000000000 implements MigrationInterface {
    name = "AddIsChangePassToUsers1781000000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` ADD \`isChangePass\` tinyint NOT NULL DEFAULT 0`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`users\` DROP COLUMN \`isChangePass\``
        );
    }
}