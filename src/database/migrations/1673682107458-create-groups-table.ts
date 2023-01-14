import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGroupsTable1673682107458 implements MigrationInterface {
  name = 'CreateGroupsTable1673682107458';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."groups_division_enum" AS ENUM('ACADEMIC', 'HEALTH')`,
    );
    await queryRunner.query(`CREATE TABLE "groups"
                             (
                               "id"         uuid                            NOT NULL DEFAULT uuid_generate_v4(),
                               "created_at" TIMESTAMP                       NOT NULL DEFAULT now(),
                               "updated_at" TIMESTAMP                       NOT NULL DEFAULT now(),
                               "name"       character varying               NOT NULL,
                               "division"   "public"."groups_division_enum" NOT NULL DEFAULT 'ACADEMIC',
                               CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id")
                             )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "groups"`);
    await queryRunner.query(`DROP TYPE "public"."groups_division_enum"`);
  }
}
