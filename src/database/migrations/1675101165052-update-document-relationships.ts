import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDocumentRelationships1675101165052
  implements MigrationInterface
{
  name = 'UpdateDocumentRelationships1675101165052';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_9dd6d2dce551bbf5d4f66052e5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "REL_9dd6d2dce551bbf5d4f66052e5"`,
    );
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_9dd6d2dce551bbf5d4f66052e5a" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_9dd6d2dce551bbf5d4f66052e5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "REL_9dd6d2dce551bbf5d4f66052e5" UNIQUE ("workflow_id")`,
    );
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_9dd6d2dce551bbf5d4f66052e5a" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
