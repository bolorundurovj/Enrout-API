import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDocumentsTable1674427263210 implements MigrationInterface {
  name = 'CreateDocumentsTable1674427263210';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."documents_state_enum" AS ENUM('draft', 'pending', 'approved', 'rejected')`,
    );
    // eslint-disable-next-line max-len
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "owner_id" uuid NOT NULL, "currently_assigned_id" uuid, "workflow_id" uuid, "state" "public"."documents_state_enum" NOT NULL, "handlers" jsonb array NOT NULL DEFAULT '{}', "title" character varying NOT NULL, "description" character varying NOT NULL, "attachment" character varying, "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "REL_9dd6d2dce551bbf5d4f66052e5" UNIQUE ("workflow_id"), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`,
    );
    // eslint-disable-next-line max-len
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_9dd6d2dce551bbf5d4f66052e5a" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_9dd6d2dce551bbf5d4f66052e5a"`,
    );
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(`DROP TYPE "public"."documents_state_enum"`);
  }
}
