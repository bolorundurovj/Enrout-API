import type { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyStudentDepartmentRelationship1673743946859
  implements MigrationInterface
{
  name = 'ModifyStudentDepartmentRelationship1673743946859';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "students" DROP CONSTRAINT "FK_c14488f46704b1c5aacfb12d232"`,
    );
    await queryRunner.query(
      `ALTER TABLE "students" DROP CONSTRAINT "REL_c14488f46704b1c5aacfb12d23"`,
    );
    await queryRunner.query(`ALTER TABLE "students"
      ADD CONSTRAINT "FK_c14488f46704b1c5aacfb12d232" FOREIGN KEY ("department_id")
        REFERENCES "departments" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "students" DROP CONSTRAINT "FK_c14488f46704b1c5aacfb12d232"`,
    );
    await queryRunner.query(`ALTER TABLE "students"
      ADD CONSTRAINT "REL_c14488f46704b1c5aacfb12d23" UNIQUE ("department_id")`);
    await queryRunner.query(`ALTER TABLE "students"
      ADD CONSTRAINT "FK_c14488f46704b1c5aacfb12d232" FOREIGN KEY ("department_id")
        REFERENCES "departments" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }
}
