import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BASE_PORT, } from './const';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(BASE_PORT);
}
bootstrap();
