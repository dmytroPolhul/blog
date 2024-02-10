import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [],
  providers: [UserRepository, UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
