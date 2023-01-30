import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTokenToUser1673388332860 implements MigrationInterface {
  name = 'addTokenToUser1673388332860';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "token" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "token"`);
  }
}
