import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { Services } from 'src/config/tcpOptions';
import { Role } from './roles';

@Injectable()
export default class RoleGuard implements CanActivate {
  constructor(
    @Inject(Services.AUTH_SERVICE) private readonly authProxy: ClientProxy,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<Role[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const token = req.headers['authorization']?.split(' ')[1];

    let activate = false;
    try {
      const msRes = await firstValueFrom(
        this.authProxy
          .send('auth-verifyRoles', { token: token, roles: requiredRoles })
          .pipe(timeout(5000)),
      );
      activate = msRes.hasRoles ?? false;
    } catch (error) {
      activate = false;
    }

    return activate;
  }
}
