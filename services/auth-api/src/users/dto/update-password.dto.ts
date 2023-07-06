import { IsNotEmpty, IsString, Min } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @Min(8)
  newPassword: string;
}
