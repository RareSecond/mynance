import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Mynance API')
    .setDescription('The Mynance API description')
    .setVersion('0.0.1')
    .addTag('mynance')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    origin: [
      /^http:\/\/localhost:\d+$/,
      /^https?:\/\/(?:[\w-]+\.)*codictive\.be$/,
    ],
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
