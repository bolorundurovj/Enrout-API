import type { MigrationInterface, QueryRunner } from 'typeorm';

export class SetDefaultDocumentState1674428470074
  implements MigrationInterface
{
  name = 'SetDefaultDocumentState1674428470074';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" ALTER COLUMN "state" SET DEFAULT 'draft'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" ALTER COLUMN "state" DROP DEFAULT`,
    );
  }
}
