import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Add validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  // Get port before Swagger setup
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  
  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('PMIC API')
    .setDescription('The PMIC API documentation')
    .setVersion('1.0')
    .addTag('users')
    .addTag('reservations')
    .addBearerAuth()
    .addServer(`http://localhost:${port}`, 'Local Development')
    .addServer('http://65.1.97.229:3000', 'Production Server')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api`);
}
bootstrap();
