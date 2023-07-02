import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import tcpOptions from './config/tcpOptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice(tcpOptions(configService));
  app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
