import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { baseSchemaColumns } from '../../baseModule/baseSchema.schema';
import { relations } from 'drizzle-orm';
import { userTable } from '../../user/entities/user.schema';

export const BlogTable = pgTable('blogs', {
  ...baseSchemaColumns,
  title: varchar('title').notNull(),
  description: varchar('description').notNull(),
  authorId: varchar('author_id'),
});

export const authorRelation = relations(userTable, ({ many }) => ({
  blogs: many(BlogTable),
}));
