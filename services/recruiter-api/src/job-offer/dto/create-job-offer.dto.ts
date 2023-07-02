import { ContractType, Experience } from '@prisma/client';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateJobOfferDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsEnum(Experience)
  @IsOptional()
  experience: Experience;

  @IsNotEmpty()
  category: string;

  @IsArray()
  @ArrayNotEmpty()
  tasks: string[];

  @IsArray()
  @ArrayNotEmpty()
  skills: string[];

  @IsNotEmpty()
  @IsEnum(ContractType)
  contractType: ContractType;

  @IsInt()
  @IsPositive()
  @IsOptional()
  remuneration: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  remoteDays: number;

  @IsDateString()
  startDate: Date;

  @IsString()
  @IsOptional()
  duration: string;

  @IsNotEmpty()
  @IsUUID()
  companyId: string;
}
