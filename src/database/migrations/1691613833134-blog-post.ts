import { MigrationInterface, QueryRunner } from "typeorm";

export class BlogPost1691613833134 implements MigrationInterface {
    name = 'BlogPost1691613833134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog_post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying NOT NULL, "mainText" character varying NOT NULL, "blogId" uuid, CONSTRAINT "PK_694e842ad1c2b33f5939de6fede" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "blog_post" ADD CONSTRAINT "blog_post_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_post" DROP CONSTRAINT "blog_post_blogId_fkey"`);
        await queryRunner.query(`DROP TABLE "blog_post"`);
    }

}
