import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './objectTypes/user.objectType';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserService } from './user.service';
import { GraphQLBoolean } from 'graphql/type';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.userService.createUser(createUserInput);
  }

  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.userService.updateUser(updateUserInput);
  }

  @Mutation(() => GraphQLBoolean)
  removeUser(@Args('id', { type: () => String }) id: string): Promise<boolean> {
    return this.userService.deleteUser(id);
  }

  @Query(() => User, { name: 'userById' })
  findOneUser(@Args('id', { type: () => String }) id: string): Promise<User> {
    return this.userService.getUser(id);
  }

  @Query(() => [User], { name: 'users' })
  findAllUsers() {
    return this.userService.getUsers();
  }
}
