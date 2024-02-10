import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { BaseService } from '../baseModule/base.service';
import { userTable } from './entities/user.schema';
import { UserRepository } from './repositories/user.repository';
import { User } from './objectTypes/user.objectType';

@Injectable()
export class UserService extends BaseService<typeof userTable> {
  constructor(private userRepository: UserRepository) {
    super(userRepository);
  }

  async createUser(request: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(request.password, 10);
    const existingUser = await this.userRepository.findOneByEmail(
      request.email,
    );
    if (existingUser) {
      throw new BadRequestException('User already registered');
    }
    return this.userRepository.save({ ...request, password: hashedPassword });
  }

  async updateUser(request: UpdateUserInput): Promise<User> {
    const user = await this.getUser(request.id);

    if (request.password && request.newPassword) {
      const passwordValid = await bcrypt.compare(
        request.password,
        user.password,
      );
      if (passwordValid) {
        request.password = await bcrypt.hash(request.newPassword, 10);
        delete request.newPassword;
      } else {
        throw new BadRequestException('Wrong input');
      }
    }

    if (request.email && request.newEmail) {
      const isValid = request.email === user.email;
      if (isValid) {
        const userWithEmail = await this.userRepository.findOneByEmail(
          request.newEmail,
        );
        if (userWithEmail) {
          throw new BadRequestException('Wrong input');
        }
        request.email = request.newEmail;
        delete request.newEmail;
      }
    }

    return this.userRepository.updateEntity({ ...user, ...request });
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.getUser(id);

    return user ? await this.userRepository.softDelete(id) : false;
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOneById(id);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async getUsers(): Promise<any> {
    return this.userRepository.findAll();
  }

  async getAuthByEmail(email: string): Promise<Partial<User>> {
    return this.userRepository.getAuthUserDataByEmail(email);
  }

  async getAuthByIdAndToken(
    id: string,
    oldToken: string,
  ): Promise<Partial<User>> {
    return this.userRepository.getAuthUserDataByIdAndToken(id, oldToken);
  }

  async updateUserToken(id: string, newToken: string): Promise<Partial<User>> {
    return this.userRepository.updateToken(id, newToken);
  }
}
