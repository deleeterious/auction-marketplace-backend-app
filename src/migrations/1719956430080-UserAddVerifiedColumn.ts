import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAddVerifiedColumn1719956430080 implements MigrationInterface {
  name = 'UserAddVerifiedColumn1719956430080';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "verified" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verified"`);
  }
}
