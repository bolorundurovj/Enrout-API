import type { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUniversityFromStudentsTable1673693199052
  implements MigrationInterface
{
  name = 'RemoveUniversityFromStudentsTable1673693199052';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "students" DROP CONSTRAINT "UQ_14d779b146e9ca6f24b5e633448"`,
    );
    await queryRunner.query(
      `ALTER TABLE "students" DROP COLUMN "university_id"`,
    );
    await queryRunner.query(`ALTER TABLE "students"
      ADD CONSTRAINT "UQ_a056c5aaf6936265feeb5d9b100" UNIQUE ("matric_no")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "students" DROP CONSTRAINT "UQ_a056c5aaf6936265feeb5d9b100"`,
    );
    await queryRunner.query(`ALTER TABLE "students"
      ADD "university_id" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "students"
      ADD CONSTRAINT "UQ_14d779b146e9ca6f24b5e633448" UNIQUE ("university_id")`);
  }
}
