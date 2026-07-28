/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const config = app.get(ConfigService);
  const prefix = config.get<string>('API_PREFIX', 'api/v1');
  const port = Number(config.get('PORT', 3001));
  const corsOriginString = config.get<string>('CORS_ORIGIN', 'http://localhost:3000,http://localhost:3002');
  const corsOrigin = corsOriginString.split(',').map(item => item.trim());

  app.setGlobalPrefix(prefix);
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Express Courier API')
    .setDescription('API cho hệ thống Website Dịch vụ Chuyển phát nhanh')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
  Logger.log(`API running on http://localhost:${port}/${prefix}`, 'Bootstrap');
  Logger.log(`Swagger docs: http://localhost:${port}/docs`, 'Bootstrap');
}
bootstrap();
