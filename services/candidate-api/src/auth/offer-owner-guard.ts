import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { Services } from 'src/config/tcpOptions';
import { Offer } from './offer';
import { Reflector } from '@nestjs/core';
import { OwnerResource } from './owner-resource';
import { ApplicationsService } from 'src/applications/applications.service';

@Injectable()
export default class OfferOwnerGuard implements CanActivate {
  constructor(
    @Inject(Services.RECRUITER_SERVICE)
    private readonly recruiterProxy: ClientProxy,
    private readonly applicationsService: ApplicationsService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (req.user == null) {
      return false;
    }

    const resource = this.reflector.get<OwnerResource>(
      'id',
      context.getHandler(),
    );

    if (resource == null) {
      return false;
    }

    return this.verifyResource(req, resource);
  }

  private async verifyResource(req: any, resource: OwnerResource) {
    if (resource === OwnerResource.OFFER) {
      return (await this.getOffers(req.user.id)).find(
        (offer) => offer.id === req.params['id'],
      ) == null
        ? false
        : true;
    }

    if (resource === OwnerResource.APPLICATION) {
      try {
        const application = await this.applicationsService.findOne(
          req.params['id'],
        );
        return (await this.getOffers(req.user.id)).find(
          (offer) => offer.id === application.offerId,
        ) == null
          ? false
          : true;
      } catch (error) {
        return false;
      }
    }

    return false;
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
