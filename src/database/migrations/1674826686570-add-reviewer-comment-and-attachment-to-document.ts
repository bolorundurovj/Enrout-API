import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReviewerCommentAndAttachmentToDocument1674826686570
  implements MigrationInterface
{
  name = 'AddReviewerCommentAndAttachmentToDocument1674826686570';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "reviewer_comment" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "reviewer_attachment" character varying`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."documents_state_enum" RENAME TO "documents_state_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."documents_state_enum" AS ENUM('draft', 'pending', 'approved', 'rejected', 'change-requested')`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ALTER COLUMN "state" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ALTER COLUMN "state" TYPE "public"."documents_state_enum" USING "state"::"text"::"public"."documents_state_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ALTER COLUMN "state" SET DEFAULT 'draft'`,
    );
    await queryRunner.query(`DROP TYPE "public"."documents_state_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."documents_state_enum_old" AS ENUM('draft', 'pending', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ALTER COLUMN "state" DROP DEFAULT`,
    );
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `ALTER TABLE "documents" ALTER COLUMN "state" TYPE "public"."documents_state_enum_old" USING "state"::"text"::"public"."documents_state_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ALTER COLUMN "state" SET DEFAULT 'draft'`,
    );
    await queryRunner.query(`DROP TYPE "public"."documents_state_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."documents_state_enum_old" RENAME TO "documents_state_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP COLUMN "reviewer_attachment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP COLUMN "reviewer_comment"`,
    );
  }
}
