import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import * as process from 'process';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userService.getAuthByEmail(email);

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
      exp: Math.floor(Date.now() / 1000) + Number(process.env.JWT_EXPIRE_IN),
      jti: uuid.v4(),
    };

    const refresh = this.jwtService.sign({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 60 * 24 * 7,
    });
    await this.userService.updateUserToken(user.id, refresh);
    const access = this.jwtService.sign(payload);
    return { access: access, session: refresh };
  }

  async refresh(oldToken: string) {
    let decoded;
    try {
      decoded = await this.jwtService.verify(oldToken);
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userService.getAuthByIdAndToken(
      decoded.userId,
      oldToken,
    );

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    const payload = {
      userId: user.id,
      role: user.role,
      sub: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + Number(process.env.JWT_EXPIRE_IN),
      jti: uuid.v4(),
    };

    const refresh = this.jwtService.sign({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + 60 * 24 * 7,
    });
    await this.userService.updateUserToken(user.id, refresh);
    const access = this.jwtService.sign(payload);
    return { access: access, session: refresh };
  }

  async validateUser(payload: any): Promise<any> {
    return await this.userService.getUserByEmail(payload.sub);
  }

  validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, storedPasswordHash);
  }
}
