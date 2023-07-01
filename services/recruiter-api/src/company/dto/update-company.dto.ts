import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  removeLogo: boolean;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  removeImages: boolean;
}
