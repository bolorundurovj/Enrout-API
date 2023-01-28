import type { MigrationInterface, QueryRunner } from 'typeorm';

export class SetPositionToAutoincrement1674899310391
  implements MigrationInterface
{
  name = 'SetPositionToAutoincrement1674899310391';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "workflow_items_position_seq" OWNED BY "workflow_items"."position"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_items" ALTER COLUMN "position" SET DEFAULT nextval('"workflow_items_position_seq"')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workflow_items" ALTER COLUMN "position" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "workflow_items_position_seq"`);
  }
}
