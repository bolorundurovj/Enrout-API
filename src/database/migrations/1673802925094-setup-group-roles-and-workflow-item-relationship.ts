import type { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupGroupRolesAndWorkflowItemRelationship1673802925094
  implements MigrationInterface
{
  name = 'SetupGroupRolesAndWorkflowItemRelationship1673802925094';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workflow_items" DROP CONSTRAINT "FK_9b2c8a1248f5d0b10b0db0c512e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_items" RENAME COLUMN "group_id" TO "group_role_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_items" RENAME CONSTRAINT "UQ_9b2c8a1248f5d0b10b0db0c512e" TO "UQ_38938e802af420ae965dbb58403"`,
    );
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `CREATE TYPE "public"."group_roles_designation_enum" AS ENUM('Head of Department', 'Dean', 'Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Teaching Assistant', 'Research Assistant', 'Admin Assistant', 'Non-Teaching Staff', 'Registrar', 'Vice Chancellor', 'Director', 'Chancellor', 'Hall Warden', 'Librarian', 'Sports Master')`,
    );
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `CREATE TABLE "group_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "designation" "public"."group_roles_designation_enum" NOT NULL, CONSTRAINT "PK_c88b2351f40bf170bc7ab7e8fda" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `ALTER TABLE "workflow_items" ADD CONSTRAINT "FK_38938e802af420ae965dbb58403" FOREIGN KEY ("group_role_id") REFERENCES "group_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workflow_items" DROP CONSTRAINT "FK_38938e802af420ae965dbb58403"`,
    );
    await queryRunner.query(`DROP TABLE "group_roles"`);
    await queryRunner.query(
      `DROP TYPE "public"."group_roles_designation_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_items" RENAME CONSTRAINT "UQ_38938e802af420ae965dbb58403" TO "UQ_9b2c8a1248f5d0b10b0db0c512e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workflow_items" RENAME COLUMN "group_role_id" TO "group_id"`,
    );
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `ALTER TABLE "workflow_items" ADD CONSTRAINT "FK_9b2c8a1248f5d0b10b0db0c512e" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
