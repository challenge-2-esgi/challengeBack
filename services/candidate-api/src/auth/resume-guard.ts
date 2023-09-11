import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Application } from '@prisma/client';
import { firstValueFrom, timeout } from 'rxjs';
import { ApplicationsService } from 'src/applications/applications.service';
import { Services } from 'src/config/tcpOptions';
import { Offer } from './offer';

export default class ResumeGuard implements CanActivate {
  constructor(
    @Inject(Services.RECRUITER_SERVICE)
    private readonly recruiterProxy: ClientProxy,
    private readonly applicationsService: ApplicationsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (req.user == null) {
      return false;
    }

    const resumeId = req.params['id'];

    if (resumeId == null) {
      return false;
    }

    try {
      const application = await this.applicationsService.findByResumeId(
        resumeId,
      );

      if (application == null) {
        return false;
      }

      // is application owner or offer owner
      if (
        application.userId === req.user.id ||
        (await this.isOfferOwner(application, req.user.id))
      ) {
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  private async isOfferOwner(application: Application, userId: string) {
    return (
      (await this.getOffers(userId)).find(
        (offer) => offer.id === application.offerId,
      ) != null
    );
  }

  private async getOffers(userId: string): Promise<Offer[]> {
    try {
      return await firstValueFrom(
        this.recruiterProxy
          .send('recruiter-findJobOffersByUserId', { userId })
          .pipe(timeout(5000)),
      );
    } catch (error) {
      return [];
    }
  }
}
