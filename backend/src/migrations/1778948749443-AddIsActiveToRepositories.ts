import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveToRepositories1778948749443 implements MigrationInterface {
    name = 'AddIsActiveToRepositories1778948749443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_42148de213279d66bf94b363bf\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`repositories\` ADD \`isActive\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`passwordHash\` \`passwordHash\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_42148de213279d66bf94b363bf\` (\`githubId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_42148de213279d66bf94b363bf\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`passwordHash\` \`passwordHash\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`repositories\` DROP COLUMN \`isActive\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_42148de213279d66bf94b363bf\` ON \`users\` (\`githubId\`)`);
    }

}
