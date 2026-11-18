import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialPostgresSchema1793029896816 implements MigrationInterface {
    name = 'InitialPostgresSchema1793029896816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "benchmark" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "inputSize" integer NOT NULL, "executionTimeMs" double precision NOT NULL, "memoryUsedKb" double precision NOT NULL, "submissionId" uuid, CONSTRAINT "PK_8cf01b709151d95a206b197041f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "repositories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "githubRepoId" character varying NOT NULL, "fullName" character varying NOT NULL, "webhookSecret" character varying NOT NULL, "blockOnRegression" boolean NOT NULL DEFAULT false, "regressionThresholdX" double precision NOT NULL DEFAULT '2', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "PK_ef0c358c04b4f4d29b8ca68ddff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a477894a09b73af227d8395187" ON "repositories" ("githubRepoId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_b5b345dab671b9a5f997fb2196" ON "repositories" ("githubRepoId", "userId") `);
        await queryRunner.query(`CREATE TYPE "public"."submissions_status_enum" AS ENUM('queued', 'running', 'completed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "submissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" text NOT NULL, "language" character varying NOT NULL, "status" "public"."submissions_status_enum" NOT NULL DEFAULT 'queued', "detectedComplexity" character varying, "confidence" double precision, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "repositoryId" uuid, CONSTRAINT "PK_10b3be95b8b2fb1e482e07d706b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "email" character varying, "passwordHash" character varying NOT NULL, "githubId" character varying, "githubUsername" character varying, "avatarUrl" character varying, "isChangePass" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_42148de213279d66bf94b363bf2" UNIQUE ("githubId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_42148de213279d66bf94b363bf" ON "users" ("githubId") `);
        await queryRunner.query(`CREATE TABLE "algorithm_patterns" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text NOT NULL, "complexity" character varying NOT NULL, CONSTRAINT "PK_ed0b7a401784771f979e41ca0ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "benchmark" ADD CONSTRAINT "FK_3837f8f4caa5a94494f513686d2" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "repositories" ADD CONSTRAINT "FK_2f29c355d9fefd2d8cf3bd79803" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "FK_eae888413ab8fc63cc48759d46a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submissions" ADD CONSTRAINT "FK_19fa28d4d10c134a9d3853165d6" FOREIGN KEY ("repositoryId") REFERENCES "repositories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_19fa28d4d10c134a9d3853165d6"`);
        await queryRunner.query(`ALTER TABLE "submissions" DROP CONSTRAINT "FK_eae888413ab8fc63cc48759d46a"`);
        await queryRunner.query(`ALTER TABLE "repositories" DROP CONSTRAINT "FK_2f29c355d9fefd2d8cf3bd79803"`);
        await queryRunner.query(`ALTER TABLE "benchmark" DROP CONSTRAINT "FK_3837f8f4caa5a94494f513686d2"`);
        await queryRunner.query(`DROP TABLE "algorithm_patterns"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_42148de213279d66bf94b363bf"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "submissions"`);
        await queryRunner.query(`DROP TYPE "public"."submissions_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b5b345dab671b9a5f997fb2196"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a477894a09b73af227d8395187"`);
        await queryRunner.query(`DROP TABLE "repositories"`);
        await queryRunner.query(`DROP TABLE "benchmark"`);
    }

}
