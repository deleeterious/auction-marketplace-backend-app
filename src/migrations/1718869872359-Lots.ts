import { MigrationInterface, QueryRunner } from 'typeorm';

export class Lots1718869872359 implements MigrationInterface {
  name = 'Lots1718869872359';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lot" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "image" character varying, "description" character varying, "status" character varying NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "currentPrice" money NOT NULL, "estimatedPrice" money NOT NULL, "startTime" TIMESTAMP WITH TIME ZONE NOT NULL, "endTime" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" integer, CONSTRAINT "PK_2ba293e2165c7b93cd766c8ac9b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "lot" ADD CONSTRAINT "FK_d96dd0000fda7f9f94386e5b871" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lot" DROP CONSTRAINT "FK_d96dd0000fda7f9f94386e5b871"`,
    );
    await queryRunner.query(`DROP TABLE "lot"`);
  }
}
