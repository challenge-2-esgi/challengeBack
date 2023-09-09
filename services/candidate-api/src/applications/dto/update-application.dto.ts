import { ApplicationStatus } from '@prisma/client';
import { IsIn } from 'class-validator';

export class UpdateApplicationDto {
  @IsIn([ApplicationStatus.REFUSED])
  status: ApplicationStatus;
}
