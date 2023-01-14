import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWorkflowTable1673689557555 implements MigrationInterface {
  name = 'CreateWorkflowTable1673689557555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "workflows"
                             (
                               "id"         uuid              NOT NULL DEFAULT uuid_generate_v4(),
                               "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
                               "updated_at" TIMESTAMP         NOT NULL DEFAULT now(),
                               "name"       character varying NOT NULL,
                               CONSTRAINT "PK_5b5757cc1cd86268019fef52e0c" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "workflow_items"
                             (
                               "id"          uuid              NOT NULL DEFAULT uuid_generate_v4(),
                               "created_at"  TIMESTAMP         NOT NULL DEFAULT now(),
                               "updated_at"  TIMESTAMP         NOT NULL DEFAULT now(),
                               "name"        character varying NOT NULL,
                               "position"    integer           NOT NULL,
                               "workflow_id" uuid              NOT NULL,
                               CONSTRAINT "PK_dfa7ba31d57bce22d110cb22708" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "workflow_items"
      ADD CONSTRAINT "FK_036f70ab4a945850da67a289222" FOREIGN KEY ("workflow_id") REFERENCES "workflows" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workflow_items" DROP CONSTRAINT "FK_036f70ab4a945850da67a289222"`,
    );
    await queryRunner.query(`DROP TABLE "workflow_items"`);
    await queryRunner.query(`DROP TABLE "workflows"`);
  }
}
