import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../../baseModule/base.repository';
import { db } from '../../../config/pg.config';
import { eq, sql } from 'drizzle-orm';
import { CreateBlogInput } from '../dto/requests/create-blog.input';
import { UpdateBlogInput } from '../dto/requests/update-blog.input';
import { Blog } from '../objectTypes/blog.objectType';
import { FilteringPaginationSorting } from '../types/filteringPaginationSorting.input';
import { BlogTable } from '../entities/blog.schema';

type NewBlog = typeof BlogTable.$inferInsert;
type _SelectedBlog = typeof BlogTable.$inferSelect;

@Injectable()
export class BlogRepository extends BaseRepository<typeof BlogTable> {
  constructor() {
    super(BlogTable);
  }

  async save(request: CreateBlogInput): Promise<Blog> {
    const blog: NewBlog = request;
    const [insertResult] = await db.insert(this.model).values(blog).returning();
    return insertResult;
  }

  async findOneByIdWithRelationsOrFail(
    blogId: string,
    relations: string[],
  ): Promise<Blog> {
    const withClause = relations.reduce((acc, relation) => {
      acc[relation] = true;
      return acc;
    }, {});

    const selectedResult = await db.query.BlogTable.findFirst({
      where: (Blog, { eq }) => eq(Blog.id, blogId),
      with: {
        ...withClause,
      },
    });

    if (!selectedResult) {
      throw new NotFoundException('Item Not Found');
    }

    return selectedResult as Blog;
  }

  //TODO: Fix
  async findMany(
    request: FilteringPaginationSorting & { relations: string[] },
  ): Promise<any> {
    const res = await db.query.BlogTable.findMany({
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

  async updateEntity(input: UpdateBlogInput): Promise<Blog> {
    const [updateResult] = await db
      .update(this.model)
      .set(input)
      .where(eq(this.model.id, input.id))
      .returning();

    return updateResult;
  }
}
