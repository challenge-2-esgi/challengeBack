import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UsersInterceptor } from 'src/interceptor/users.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import RoleGuard from 'src/roles/RoleGuard';
import { Roles } from 'src/roles/roles.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
@Roles(Role.ADMIN)
@UseGuards(RoleGuard)
@UseInterceptors(UsersInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  findAll(
    @Query()
    params: {
      skip?: number;
      take?: number;
    },
  ) {
    return this.usersService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
