import { ConfigService } from '@nestjs/config';
import { TcpOptions, Transport } from '@nestjs/microservices';

export default (configService: ConfigService) =>
  ({
    transport: Transport.TCP,
    options: {
      host: configService.get('MICROSERVICE_HOST'),
      port: configService.get('MICROSERVICE_PORT'),
    },
  } as TcpOptions);
