import { boolean, pgEnum, pgTable, varchar } from 'drizzle-orm/pg-core';
import { baseSchemaColumns } from '../../baseModule/baseSchema.schema';
import { Role } from '../../../common/enums/userRole.enum';

export const rolesEnum = pgEnum('role', [Role.WRITER, Role.MODERATOR]);

export const userTable = pgTable('users', {
  ...baseSchemaColumns,
  firstName: varchar('first_name').notNull(),
  lastName: varchar('last_name').notNull(),
  email: varchar('email').notNull(),
  password: varchar('password').notNull(),
  isActive: boolean('is_active').default(false),
  role: rolesEnum('role').default(Role.WRITER).notNull(),
  token: varchar('token'),
});
