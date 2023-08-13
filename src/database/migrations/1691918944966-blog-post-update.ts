import { MigrationInterface, QueryRunner } from 'typeorm';

export class BlogPostUpdate1691918944966 implements MigrationInterface {
  name = 'BlogPostUpdate1691918944966';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog_post" ADD "isPublish" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_post" ADD "tags" character varying array`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "blog_post" DROP COLUMN "tags"`);
    await queryRunner.query(`ALTER TABLE "blog_post" DROP COLUMN "isPublish"`);
  }
}
