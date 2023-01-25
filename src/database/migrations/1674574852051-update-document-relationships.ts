import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDocumentRelationships1674574852051
  implements MigrationInterface
{
  name = 'UpdateDocumentRelationships1674574852051';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_888a4852e27627d1ebd8a094e98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "UQ_888a4852e27627d1ebd8a094e98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_888a4852e27627d1ebd8a094e98" FOREIGN KEY 
            ("owner_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_888a4852e27627d1ebd8a094e98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "UQ_888a4852e27627d1ebd8a094e98" UNIQUE ("owner_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_888a4852e27627d1ebd8a094e98" FOREIGN KEY
             ("owner_id") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
