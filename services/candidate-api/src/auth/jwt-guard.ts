import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { Services } from 'src/config/tcpOptions';

@Injectable()
export default class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(Services.AUTH_SERVICE) private readonly authProxy: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.headers['authorization']?.split(' ')[1];
    let res = false;
    try {
      res = await firstValueFrom(
        this.authProxy
          .send('auth-validateJwt', { token: token })
          .pipe(timeout(5000)),
      );
    } catch (error) {
      res = false;
    }

    return res;
  }
}
