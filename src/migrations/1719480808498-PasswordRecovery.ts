import { MigrationInterface, QueryRunner } from 'typeorm';

export class PasswordRecovery1719480808498 implements MigrationInterface {
  name = 'PasswordRecovery1719480808498';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "password_recovery" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "userId" integer, CONSTRAINT "REL_f5b57d414cf38032bbbe9ec578" UNIQUE ("userId"), CONSTRAINT "PK_104b7650227e31deb0f4c9e7d4b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "password_recovery" ADD CONSTRAINT "FK_f5b57d414cf38032bbbe9ec578d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "password_recovery" DROP CONSTRAINT "FK_f5b57d414cf38032bbbe9ec578d"`,
    );
    await queryRunner.query(`DROP TABLE "password_recovery"`);
  }
}
