import {Resolver, Mutation, Args, Context} from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver('Auth')
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}


    @Mutation(() => String)
    async login(
        @Args('username') username: string,
        @Args('password') password: string,
        @Context() context: any,
    ): Promise<string> {
        const token = await this.authService.login(username, password);
        const res = context.res;
        res.cookie('token', token, {httpOnly: true});
        return token
    }

    @Mutation(() => Boolean)
    logout(@Context() context: any): boolean {
        const res = context.res;
        res.clearCookie('token');
        return true;
    }
}
