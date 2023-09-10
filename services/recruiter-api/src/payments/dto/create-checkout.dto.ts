import { IsString } from 'class-validator';

export class CreateCheckoutDto {
  @IsString()
  priceId: string;

  @IsString()
  companyId: string;
}
