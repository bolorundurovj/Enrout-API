import type { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyStaffDepartmentRelationship1673744691390
  implements MigrationInterface
{
  name = 'ModifyStaffDepartmentRelationship1673744691390';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "staff" DROP CONSTRAINT "FK_51b371508b14db31bee80fded0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff" DROP CONSTRAINT "REL_51b371508b14db31bee80fded0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff" ADD CONSTRAINT "FK_51b371508b14db31bee80fded0a" FOREIGN KEY ("department_id")
    REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "staff" DROP CONSTRAINT "FK_51b371508b14db31bee80fded0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff" ADD CONSTRAINT "REL_51b371508b14db31bee80fded0" UNIQUE ("department_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff" ADD CONSTRAINT "FK_51b371508b14db31bee80fded0a" FOREIGN KEY ("department_id")
    REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
