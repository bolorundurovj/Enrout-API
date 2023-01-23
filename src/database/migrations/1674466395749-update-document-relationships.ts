import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDocumentRelationships1674466395749
  implements MigrationInterface
{
  name = 'UpdateDocumentRelationships1674466395749';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "UQ_888a4852e27627d1ebd8a094e98" UNIQUE ("owner_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "UQ_b84e9e86a034ee0fdbadda39394" UNIQUE ("currently_assigned_id")`,
    );
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_888a4852e27627d1ebd8a094e98" FOREIGN KEY ("owner_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_888a4852e27627d1ebd8a094e98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "UQ_b84e9e86a034ee0fdbadda39394"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "UQ_888a4852e27627d1ebd8a094e98"`,
    );
  }
}
