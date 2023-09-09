import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UsersInterceptor } from 'src/interceptor/users.interceptor';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './loginDto/loginDto';

@Controller('auth')
@UseInterceptors(UsersInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  // Microservice listeners
  @MessagePattern('auth-validateJwt')
  async validateJwt(@Payload() { token }: { token: string }) {
    return await this.authService.validateToken(token);
  }

  @MessagePattern('auth-getLoggedInUser')
  async getLoggedInUser(@Payload() { token }: { token: string }) {
    try {
      return await this.authService.getUserFrom(token);
    } catch (error) {
      return null;
    }
  }

  @MessagePattern('auth-verifyRoles')
  async verifyRoles(
    @Payload() { token, roles }: { token: string; roles: string[] },
  ) {
    return { hasRoles: await this.authService.verifyRoles(roles, token) };
  }

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    let user = null;
    try {
      user = await this.authService.register(createUserDto);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException();
      }
      throw new BadRequestException();
    }

    return user;
  }

  @Post('login')
  async login(@Body() user: LoginDto) {
    return this.authService.login(user);
  }
}
