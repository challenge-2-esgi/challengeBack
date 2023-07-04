import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './loginDto/loginDto';
import { UsersInterceptor } from 'src/interceptor/users.interceptor';

@Controller('auth')
@UseInterceptors(UsersInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() user: LoginDto) {
    return this.authService.login(user);
  }
}
