import { MigrationInterface, QueryRunner } from "typeorm";

export class PasswordRecoveryCreateDateColumn1719485279204 implements MigrationInterface {
    name = 'PasswordRecoveryCreateDateColumn1719485279204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_recovery" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_recovery" DROP COLUMN "createdAt"`);
    }

}
