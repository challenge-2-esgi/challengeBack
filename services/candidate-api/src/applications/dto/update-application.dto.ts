import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './create-application.dto';
import { ApplicationStatus } from '@prisma/client';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  status: ApplicationStatus;
}
