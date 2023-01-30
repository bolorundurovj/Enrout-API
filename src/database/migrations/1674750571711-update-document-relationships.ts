import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDocumentRelationships1674750571711
  implements MigrationInterface
{
  name = 'UpdateDocumentRelationships1674750571711';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_b84e9e86a034ee0fdbadda39394"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "UQ_b84e9e86a034ee0fdbadda39394"`,
    );
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_b84e9e86a034ee0fdbadda39394" FOREIGN KEY ("currently_assigned_id") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_b84e9e86a034ee0fdbadda39394"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "UQ_b84e9e86a034ee0fdbadda39394" UNIQUE ("currently_assigned_id")`,
    );
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_b84e9e86a034ee0fdbadda39394" FOREIGN KEY ("currently_assigned_id") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
