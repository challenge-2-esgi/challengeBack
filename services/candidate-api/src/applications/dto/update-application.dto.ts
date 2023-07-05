import { ApplicationStatus } from '@prisma/client';

export class UpdateApplicationDto {
  status: ApplicationStatus;
}
