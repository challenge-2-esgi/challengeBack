import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class MsJobOfferInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((jobOffer) => {
        if (jobOffer == null) {
          return null;
        }

        if (Array.isArray(jobOffer)) {
          return jobOffer.map((o) => ({
            id: o.id,
            title: o.title,
            company: {
              name: o.company.name,
              logo: o.company.logo,
            },
          }));
        }

        return {
          id: jobOffer.id,
          title: jobOffer.title,
          company: {
            name: jobOffer.company.name,
            logo: jobOffer.company.logo,
          },
        };
      }),
    );
  }
}
