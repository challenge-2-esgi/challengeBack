import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class MsUsersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      // Use the `map` operator to transform the user object
      map((user) => {
        if (user == null) {
          return null;
        }
        // If the user object is an array, map over it and remove the properties
        if (Array.isArray(user)) {
          return user.map(
            ({ password, roles, createdAt, updatedAt, ...msUser }) => msUser,
          );
        }

        // Otherwise, assume the user object is a single object and remove the properties
        const { password, roles, createdAt, updatedAt, ...msUser } = user;
        return msUser;
      }),
    );
  }
}
