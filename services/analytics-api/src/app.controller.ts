import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('analytics')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getData() {
    return this.appService.getData();
  }
}
