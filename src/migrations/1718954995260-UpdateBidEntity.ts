import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateBidEntity1718954995260 implements MigrationInterface {
  name = 'UpdateBidEntity1718954995260';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid" ADD CONSTRAINT "UQ_deefa12808e0105b7506ac58725" UNIQUE ("lotId", "userId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid" DROP CONSTRAINT "UQ_deefa12808e0105b7506ac58725"`,
    );
  }
}
