import { MigrationInterface, QueryRunner } from "typeorm";

export class LotUserRelationUpdate1718881824454 implements MigrationInterface {
    name = 'LotUserRelationUpdate1718881824454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lot" DROP CONSTRAINT "FK_d96dd0000fda7f9f94386e5b871"`);
        await queryRunner.query(`ALTER TABLE "lot" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lot" ADD CONSTRAINT "FK_d96dd0000fda7f9f94386e5b871" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lot" DROP CONSTRAINT "FK_d96dd0000fda7f9f94386e5b871"`);
        await queryRunner.query(`ALTER TABLE "lot" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lot" ADD CONSTRAINT "FK_d96dd0000fda7f9f94386e5b871" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
