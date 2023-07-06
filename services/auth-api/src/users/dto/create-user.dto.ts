import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Min(8)
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  roles: Role;
}
