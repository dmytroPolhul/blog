import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../../baseModule/base.repository';
import { db } from '../../../config/pg.config';
import { eq, sql } from 'drizzle-orm';
import { BlogPostTable } from '../entities/blog-post.schema';
import { BlogPost } from '../objectTypes/blog-post.objectTypes';
import { CreateBlogPostInput } from '../dto/create-blog-post.input';
import { UpdateBlogPostInput } from '../dto/update-blog-post.input';

type NewBlogPost = typeof BlogPostTable.$inferInsert;
type _SelectedBlogPost = typeof BlogPostTable.$inferSelect;

@Injectable()
export class BlogPostRepository extends BaseRepository<typeof BlogPostTable> {
  constructor() {
    super(BlogPostTable);
  }

  async save(request: CreateBlogPostInput): Promise<BlogPost> {
    const post: NewBlogPost = request;
    const [insertResult] = await db.insert(this.model).values(post).returning();
    return insertResult;
  }

  async findOneByIdWithRelationsOrFail(
    blogId: string,
    relations: string[],
  ): Promise<BlogPost> {
    const withClause = relations.reduce((acc, relation) => {
      acc[relation] = true;
      return acc;
    }, {});

    const selectedResult = await db.query.BlogPostTable.findFirst({
      where: (BlogPost, { eq }) => eq(BlogPost.id, blogId),
      with: {
        ...withClause,
      },
    });

    if (!selectedResult) {
      throw new NotFoundException('Item Not Found');
    }

    return selectedResult;
  }

  //TODO: Fix
  async findMany(request: any): Promise<any> {
    const res: BlogPost[] = await db.query.BlogPostTable.findMany({
      offset: request.pagination.offset,
      limit: request.pagination.limit,
    });

    const [totalCount] = await db
      .select({ count: sql<number>`cast(count(${this.model.id}) as int)` })
      .from(this.model);

    return [res, totalCount.count];
  }

  async softDelete(blogId: string): Promise<boolean> {
    const [updateResult] = await db
      .update(this.model)
      .set({ deletedAt: new Date() })
      .where(eq(this.model.id, blogId))
      .returning();
    return !!updateResult;
  }

  async hardDelete(blogId: string): Promise<boolean> {
    const [updateResult] = await db
      .delete(this.model)
      .where(eq(this.model.id, blogId))
      .returning();
    return !!updateResult;
  }

  async updateEntity(input: UpdateBlogPostInput): Promise<BlogPost> {
    const [updateResult] = await db
      .update(this.model)
      .set(input)
      .where(eq(this.model.id, input.id))
      .returning();

    return updateResult;
  }
}
