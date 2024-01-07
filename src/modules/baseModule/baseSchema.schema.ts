import { text, timestamp } from 'drizzle-orm/pg-core';
import { v4 as uuidv4 } from 'uuid';

export const baseSchemaColumns = {
  id: text('id').$defaultFn(() => uuidv4()),
  createdAt: timestamp('created_at', {
    precision: 6,
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  updatedAt: timestamp('updated_at', {
    precision: 6,
    withTimezone: true,
    mode: 'date',
  }).defaultNow(),
  deletedAt: timestamp('deleted_at', {
    precision: 6,
    withTimezone: true,
    mode: 'date',
  }),
};
