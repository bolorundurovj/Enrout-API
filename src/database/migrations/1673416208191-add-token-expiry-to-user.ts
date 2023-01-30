import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTokenExpiryToUser1673416208191 implements MigrationInterface {
  name = 'AddTokenExpiryToUser1673416208191';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "token_expiry" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "token_expiry"`);
  }
}
