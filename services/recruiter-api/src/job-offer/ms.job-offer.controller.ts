import { Controller, UseInterceptors } from '@nestjs/common';
import { JobOfferService } from './job-offer.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MsJobOfferInterceptor } from 'src/interceptor/ms.job-offer.interceptor';
import { CompanyService } from 'src/company/company.service';

@Controller()
export class MsJobOfferController {
  constructor(
    private readonly jobOfferService: JobOfferService,
    private readonly companyService: CompanyService,
  ) {}

  @MessagePattern('recruiter-findJobOffersByIds')
  @UseInterceptors(MsJobOfferInterceptor)
  async findJobOffersByIds(@Payload() { offerIds }: { offerIds: string[] }) {
    return await this.jobOfferService.findManyByIds(offerIds);
  }

  @MessagePattern('recruiter-findJobOffersByUserId')
  async findJobOffersByUserId(@Payload() { userId }: { userId: string }) {
    try {
      const company = await this.companyService.findByOwnerId(userId);
      return await this.jobOfferService.findAllByCompany(company.id);
    } catch (error) {
      return [];
    }
  }
}
