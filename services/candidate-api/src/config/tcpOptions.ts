import { ConfigService } from '@nestjs/config';
import { ClientProvider, TcpOptions, Transport } from '@nestjs/microservices';

enum Services {
  AUTH_SERVICE = 'AUTH_SERVICE',
}

export default (configService: ConfigService) =>
  ({
    transport: Transport.TCP,
    options: {
      host: configService.get('MICROSERVICE_HOST'),
      port: configService.get('MICROSERVICE_PORT'),
    },
  } as TcpOptions);

const authService = (configService: ConfigService): ClientProvider => ({
  transport: Transport.TCP,
  options: {
    host: configService.get('AUTH_SERVICE_HOST'),
    port: configService.get('AUTH_SERVICE_PORT'),
  },
});

export { Services, authService };
