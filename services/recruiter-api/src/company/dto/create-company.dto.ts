import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  siren: string;

  @IsNotEmpty()
  website: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  size: number;

  @IsNotEmpty()
  sector: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  motivation: string;

  @IsNotEmpty()
  @IsUUID()
  ownerId: string;

  // address
  @IsNotEmpty()
  streetNumber: string;

  @IsNotEmpty()
  street: string;

  @IsNotEmpty()
  postcode: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  country: string;
}
