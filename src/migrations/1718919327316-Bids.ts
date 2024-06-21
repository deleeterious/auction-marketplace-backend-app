import { MigrationInterface, QueryRunner } from 'typeorm';

export class Bids1718919327316 implements MigrationInterface {
  name = 'Bids1718919327316';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bid" ("id" SERIAL NOT NULL, "price" money NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "lotId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_ed405dda320051aca2dcb1a50bb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid" ADD CONSTRAINT "FK_03de8f257efea9dc91146efd786" FOREIGN KEY ("lotId") REFERENCES "lot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid" ADD CONSTRAINT "FK_b0f254bd6d29d3da2b6a8af262b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid" DROP CONSTRAINT "FK_b0f254bd6d29d3da2b6a8af262b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid" DROP CONSTRAINT "FK_03de8f257efea9dc91146efd786"`,
    );
    await queryRunner.query(`DROP TABLE "bid"`);
  }
}
