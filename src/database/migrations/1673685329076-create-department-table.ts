import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDepartmentTable1673685329076 implements MigrationInterface {
  name = 'CreateDepartmentTable1673685329076';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "departments"
                             (
                               "id"         uuid              NOT NULL DEFAULT uuid_generate_v4(),
                               "created_at" TIMESTAMP         NOT NULL DEFAULT now(),
                               "updated_at" TIMESTAMP         NOT NULL DEFAULT now(),
                               "group_id"   uuid              NOT NULL,
                               "name"       character varying NOT NULL,
                               CONSTRAINT "PK_839517a681a86bb84cbcc6a1e9d" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "departments"
      ADD CONSTRAINT "FK_069606d7eb8b16daad48a03d736" FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "departments" DROP CONSTRAINT "FK_069606d7eb8b16daad48a03d736"`,
    );
    await queryRunner.query(`DROP TABLE "departments"`);
  }
}
