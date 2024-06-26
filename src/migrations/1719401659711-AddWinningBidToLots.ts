import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWinningBidToLots1719401659711 implements MigrationInterface {
    name = 'AddWinningBidToLots1719401659711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lot" ADD "winningBidId" integer`);
        await queryRunner.query(`ALTER TABLE "lot" ADD CONSTRAINT "UQ_09c7ded84b83231b64ad389acfd" UNIQUE ("winningBidId")`);
        await queryRunner.query(`ALTER TABLE "lot" ADD CONSTRAINT "FK_09c7ded84b83231b64ad389acfd" FOREIGN KEY ("winningBidId") REFERENCES "bid"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lot" DROP CONSTRAINT "FK_09c7ded84b83231b64ad389acfd"`);
        await queryRunner.query(`ALTER TABLE "lot" DROP CONSTRAINT "UQ_09c7ded84b83231b64ad389acfd"`);
        await queryRunner.query(`ALTER TABLE "lot" DROP COLUMN "winningBidId"`);
    }

}
