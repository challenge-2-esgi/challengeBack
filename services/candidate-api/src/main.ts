import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import tcpOptions from './config/tcpOptions';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice(tcpOptions(configService));
  app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
