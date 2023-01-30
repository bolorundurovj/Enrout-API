import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGroupToWorkflowTable1673690607029
  implements MigrationInterface
{
  name = 'AddGroupToWorkflowTable1673690607029';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "workflow_items"
      ADD "group_id" uuid NOT NULL`);
    await queryRunner.query(`ALTER TABLE "workflow_items"
      ADD CONSTRAINT "UQ_9b2c8a1248f5d0b10b0db0c512e" UNIQUE ("group_id")`);
    await queryRunner.query(`ALTER TABLE "workflow_items"
      ADD CONSTRAINT "FK_9b2c8a1248f5d0b10b0db0c512e" FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workflow_items" DROP CONSTRAINT "FK_9b2c8a1248f5d0b10b0db0c512e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_items" DROP CONSTRAINT "UQ_9b2c8a1248f5d0b10b0db0c512e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_items" DROP COLUMN "group_id"`,
    );
  }
}
