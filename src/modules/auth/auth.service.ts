import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.findOne({
      where: { email, status: true },
      select: ['password', 'email', 'status', 'role', 'id'],
    });

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    const validatePassword = await this.validatePassword(
      password,
      user.password,
    );

    if (!validatePassword) {
      throw new UnauthorizedException('Login was not Successful');
    }

    const payload = {
      userId: user.id,
      role: user.role,
      sub: user.email,
      iat: Math.floor(Date.now() / 1000),
      jti: uuid.v4(),
    };
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: any): Promise<any> {
    return await this.userService.findOne({ where: { email: payload.sub } });
  }

  validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, storedPasswordHash);
  }
}
