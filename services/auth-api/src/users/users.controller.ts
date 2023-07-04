import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  UnprocessableEntityException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UsersInterceptor } from 'src/interceptor/users.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { Role, User } from '@prisma/client';
import RoleGuard from 'src/roles/RoleGuard';
import { Roles } from 'src/roles/roles.decorator';
import { LoggedInUser } from 'src/auth/decorator/user.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
@UseGuards(RoleGuard)
@UseInterceptors(UsersInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  @Roles(Role.ADMIN)
  findAll(
    @Query()
    params: {
      skip?: number;
      take?: number;
    },
  ) {
    return this.usersService.findAll(params);
  }

  @Get('current')
  findCurrentUser(@LoggedInUser() loggedInUser: User) {
    return loggedInUser;
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('current')
  updateCurrentUser(
    @LoggedInUser() loggedInUser: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(loggedInUser.id, updateUserDto);
  }

  @Patch('current/edit-password')
  async editCurrentUserPassword(
    @LoggedInUser() loggedInUser: User,
    @Body() dto: UpdatePasswordDto,
  ) {
    let user = null;
    try {
      user = await this.usersService.changePassword(loggedInUser.id, dto);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException();
      }

      throw new UnprocessableEntityException();
    }

    return user;
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
