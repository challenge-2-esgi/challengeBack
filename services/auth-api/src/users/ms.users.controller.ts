import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MsUsersInterceptor } from 'src/interceptor/ms.user.interceptor';
import { UsersService } from './users.service';

@Controller()
@UseInterceptors(MsUsersInterceptor)
export class MsUsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('auth-findUsersByIds')
  async findUsersByIds(@Payload() { userIds }: { userIds: string[] }) {
    return await this.usersService.findManyByIds(userIds);
  }
}
