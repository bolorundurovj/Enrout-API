import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStaffTable1673727800138 implements MigrationInterface {
  name = 'CreateStaffTable1673727800138';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."staff_designation_enum" AS ENUM('Head of Department', 'Dean', 'Professor', 'Associate Professor', 'Assistant Professor',
      'Lecturer', 'Teaching Assistant', 'Research Assistant', 'Admin Assistant', 'Non-Teaching Staff', 'Registrar',
      'Vice Chancellor', 'Director', 'Chancellor', 'Hall Warden', 'Librarian', 'Sports Master')`,
    );
    await queryRunner.query(`CREATE TABLE "staff"
                             (
                               "id"            uuid                              NOT NULL DEFAULT uuid_generate_v4(),
                               "created_at"    TIMESTAMP                         NOT NULL DEFAULT now(),
                               "updated_at"    TIMESTAMP                         NOT NULL DEFAULT now(),
                               "first_name"    character varying                 NOT NULL,
                               "last_name"     character varying                 NOT NULL,
                               "designation"   "public"."staff_designation_enum" NOT NULL DEFAULT 'Lecturer',
                               "email"         character varying                 NOT NULL,
                               "password"      character varying                 NOT NULL,
                               "staff_id"      character varying                 NOT NULL,
                               "phone"         character varying,
                               "avatar"        character varying,
                               "token"         character varying,
                               "token_expiry"  TIMESTAMP,
                               "department_id" uuid                              NOT NULL,
                               CONSTRAINT "UQ_902985a964245652d5e3a0f5f6a" UNIQUE ("email"),
                               CONSTRAINT "UQ_ce6869e5d8a52ed3edd5cb750f6" UNIQUE ("staff_id"),
                               CONSTRAINT "REL_51b371508b14db31bee80fded0" UNIQUE ("department_id"),
                               CONSTRAINT "PK_e4ee98bb552756c180aec1e854a" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "staff"
      ADD CONSTRAINT "FK_51b371508b14db31bee80fded0a" FOREIGN KEY
        ("department_id") REFERENCES "departments" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "staff" DROP CONSTRAINT "FK_51b371508b14db31bee80fded0a"`,
    );
    await queryRunner.query(`DROP TABLE "staff"`);
    await queryRunner.query(`DROP TYPE "public"."staff_designation_enum"`);
  }
}
