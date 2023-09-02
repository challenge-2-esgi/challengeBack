import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBookmarkDto {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  offerId: string;
}
