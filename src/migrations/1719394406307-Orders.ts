import { MigrationInterface, QueryRunner } from 'typeorm';

export class Orders1719394406307 implements MigrationInterface {
  name = 'Orders1719394406307';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "order" ("id" SERIAL NOT NULL, "arrivalLocation" character varying NOT NULL, "arrivalType" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "lotId" integer NOT NULL, "bidId" integer NOT NULL, CONSTRAINT "REL_6ff3196948003a5276c03d327f" UNIQUE ("lotId"), CONSTRAINT "REL_f442081cc8673623c2a7078fa8" UNIQUE ("bidId"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_6ff3196948003a5276c03d327fe" FOREIGN KEY ("lotId") REFERENCES "lot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_f442081cc8673623c2a7078fa8b" FOREIGN KEY ("bidId") REFERENCES "bid"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_f442081cc8673623c2a7078fa8b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_6ff3196948003a5276c03d327fe"`,
    );
    await queryRunner.query(`DROP TABLE "order"`);
  }
}
