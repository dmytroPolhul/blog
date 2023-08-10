import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {RoleGuard} from "../../modules/auth/guards/role.guard";
import {JwtAuthGuard} from "../../modules/auth/guards/jwtAuth.guard";

export function AuthPermission(...roles: string[]) {
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(JwtAuthGuard, RoleGuard),
    );
}
