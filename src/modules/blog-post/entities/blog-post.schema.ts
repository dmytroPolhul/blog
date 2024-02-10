import { boolean, pgTable, varchar } from 'drizzle-orm/pg-core';
import { baseSchemaColumns } from '../../baseModule/baseSchema.schema';
import { relations } from 'drizzle-orm';
import { BlogTable } from '../../blog/entities/blog.schema';

export const blogRelations = relations(BlogTable, ({ one }) => ({
  blog: one(BlogTable),
}));

export const BlogPostTable = pgTable('blog-post', {
  ...baseSchemaColumns,
  title: varchar('title').notNull(),
  mainText: varchar('main_text').notNull(),
  isPublish: boolean('is_publish').default(false),
});

export const postRelations = relations(BlogPostTable, ({ many }) => ({
  posts: many(BlogPostTable),
}));
