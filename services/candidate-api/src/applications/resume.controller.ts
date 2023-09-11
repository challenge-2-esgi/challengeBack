import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import JwtAuthGuard from 'src/auth/jwt-guard';
import { ApplicationsService } from './applications.service';
import ResumeGuard from 'src/auth/resume-guard';

@UseGuards(JwtAuthGuard, ResumeGuard)
@Controller('resumes')
export class ResumeController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get(':id')
  async findOne(
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ) {
    try {
      const resume = await this.applicationsService.findResume(id);
      res.attachment('resume');
      res.send(resume.toString('base64'));
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
