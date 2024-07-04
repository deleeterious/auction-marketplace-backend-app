import { MigrationInterface, QueryRunner } from "typeorm";

export class FixTypesAcrossDB1720000623413 implements MigrationInterface {
    name = 'FixTypesAcrossDB1720000623413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birthDate"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "birthDate" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lot" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "lot" ADD "image" text`);
        await queryRunner.query(`ALTER TABLE "lot" DROP COLUMN "currentPrice"`);
        await queryRunner.query(`ALTER TABLE "lot" ADD "currentPrice" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lot" DROP COLUMN "estimatedPrice"`);
        await queryRunner.query(`ALTER TABLE "lot" ADD "estimatedPrice" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lot" DROP COLUMN "estimatedPrice"`);
        await queryRunner.query(`ALTER TABLE "lot" ADD "estimatedPrice" money NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lot" DROP COLUMN "currentPrice"`);
        await queryRunner.query(`ALTER TABLE "lot" ADD "currentPrice" money NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lot" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "lot" ADD "image" character varying`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birthDate"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "birthDate" date NOT NULL`);
    }

}
