import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStudentsTable1673692539248 implements MigrationInterface {
  name = 'CreateStudentsTable1673692539248';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."students_role_enum" AS ENUM('UNDERGRADUATE', 'GRADUATE', 'POSTGRADUATE')`,
    );
    await queryRunner.query(`CREATE TABLE "students"
                             (
                               "id"            uuid                          NOT NULL DEFAULT uuid_generate_v4(),
                               "created_at"    TIMESTAMP                     NOT NULL DEFAULT now(),
                               "updated_at"    TIMESTAMP                     NOT NULL DEFAULT now(),
                               "first_name"    character varying             NOT NULL,
                               "last_name"     character varying             NOT NULL,
                               "role"          "public"."students_role_enum" NOT NULL DEFAULT 'UNDERGRADUATE',
                               "email"         character varying             NOT NULL,
                               "password"      character varying             NOT NULL,
                               "matric_no"     character varying             NOT NULL,
                               "phone"         character varying,
                               "avatar"        character varying,
                               "university_id" character varying             NOT NULL,
                               "token"         character varying,
                               "token_expiry"  TIMESTAMP,
                               "department_id" uuid                          NOT NULL,
                               CONSTRAINT "UQ_25985d58c714a4a427ced57507b" UNIQUE ("email"),
                               CONSTRAINT "UQ_14d779b146e9ca6f24b5e633448" UNIQUE ("university_id"),
                               CONSTRAINT "REL_c14488f46704b1c5aacfb12d23" UNIQUE ("department_id"),
                               CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "students"
      ADD CONSTRAINT "FK_c14488f46704b1c5aacfb12d232" FOREIGN KEY
        ("department_id") REFERENCES "departments" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "students" DROP CONSTRAINT "FK_c14488f46704b1c5aacfb12d232"`,
    );
    await queryRunner.query(`DROP TABLE "students"`);
    await queryRunner.query(`DROP TYPE "public"."students_role_enum"`);
  }
}
