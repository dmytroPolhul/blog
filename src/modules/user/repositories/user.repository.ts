import { Injectable } from '@nestjs/common';
import { userTable } from '../entities/user.schema';
import { BaseRepository } from '../../baseModule/base.repository';
import { db } from '../../../config/pg.config';
import { User } from '../objectTypes/user.objectType';
import { CreateUserInput } from '../dto/create-user.input';
import { and, eq } from 'drizzle-orm';
import { UpdateUserInput } from '../dto/update-user.input';

type NewUser = typeof userTable.$inferInsert;
type _SelectedUser = typeof userTable.$inferSelect;

@Injectable()
export class UserRepository extends BaseRepository<typeof userTable> {
  constructor() {
    super(userTable);
  }

  async save(request: CreateUserInput): Promise<User> {
    const user: NewUser = request;
    const [insertResult] = await db.insert(this.model).values(user).returning();
    return insertResult;
  }

  async findOneByEmail(email: string): Promise<User> {
    const [selectResult] = await db
      .select()
      .from(this.model)
      .where(eq(this.model.email, email));

    return selectResult;
  }

  async findOneById(userId: string): Promise<User> {
    const [selectResult] = await db
      .select()
      .from(this.model)
      .where(eq(this.model.id, userId));

    return selectResult;
  }

  async softDelete(userId: string): Promise<boolean> {
    const [updateResult] = await db
      .update(this.model)
      .set({ isActive: false, deletedAt: new Date() })
      .where(eq(this.model.id, userId))
      .returning();
    return !!updateResult;
  }

  async updateEntity(input: UpdateUserInput): Promise<User> {
    const [updateResult] = await db
      .update(this.model)
      .set(input)
      .where(eq(this.model.id, input.id))
      .returning();

    return updateResult;
  }

  async getAuthUserDataByEmail(email: string): Promise<Partial<User>> {
    const [selectResult] = await db
      .select({
        id: this.model.id,
        password: this.model.password,
        email: this.model.email,
        isActive: this.model.isActive,
        role: this.model.role,
      })
      .from(this.model)
      .where(and(eq(this.model.email, email), eq(this.model.isActive, true)));

    return selectResult;
  }

  async getAuthUserDataByIdAndToken(
    id: string,
    oldToken: string,
  ): Promise<Partial<User>> {
    const [selectResult] = await db
      .select({
        id: this.model.id,
        password: this.model.password,
        email: this.model.email,
        isActive: this.model.isActive,
        role: this.model.role,
      })
      .from(this.model)
      .where(
        and(
          eq(this.model.id, id),
          eq(this.model.token, oldToken),
          eq(this.model.isActive, true),
        ),
      );

    return selectResult;
  }

  async updateToken(id: string, token: string): Promise<User> {
    const [updateResult] = await db
      .update(this.model)
      .set({ token })
      .where(eq(this.model.id, id))
      .returning();

    return updateResult;
  }
}
