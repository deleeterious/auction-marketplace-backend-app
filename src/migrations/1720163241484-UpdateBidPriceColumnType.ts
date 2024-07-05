import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBidPriceColumnType1720163241484 implements MigrationInterface {
    name = 'UpdateBidPriceColumnType1720163241484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bid" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "bid" ADD "price" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bid" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "bid" ADD "price" money NOT NULL`);
    }

}
