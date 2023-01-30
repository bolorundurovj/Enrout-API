import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateWorkflowRelationships1674900308776
  implements MigrationInterface
{
  name = 'UpdateWorkflowRelationships1674900308776';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workflow_items" DROP CONSTRAINT "FK_38938e802af420ae965dbb58403"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_items" DROP CONSTRAINT "UQ_38938e802af420ae965dbb58403"`,
    );
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `ALTER TABLE "workflow_items" ADD CONSTRAINT "FK_38938e802af420ae965dbb58403" FOREIGN KEY ("group_role_id") REFERENCES "group_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workflow_items" DROP CONSTRAINT "FK_38938e802af420ae965dbb58403"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_items" ADD CONSTRAINT "UQ_38938e802af420ae965dbb58403" UNIQUE ("group_role_id")`,
    );
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `ALTER TABLE "workflow_items" ADD CONSTRAINT "FK_38938e802af420ae965dbb58403" FOREIGN KEY ("group_role_id") REFERENCES "group_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
