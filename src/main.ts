import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SanitizeInterceptor } from './common/interceptors/sanitize.interceptor';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,             // elimina campos que no estén en el DTO
      forbidNonWhitelisted: true,  // lanza error si mandan campos extra
      transform: true,             // transforma los datos al tipo del DTO
    }),
  );
  app.enableCors({
    origin: 'http://localhost:3001',  // Asegúrate de que el puerto coincida con el de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Si estás utilizando cookies o autenticación
  });
  
  // Interceptor global
  app.useGlobalInterceptors(new SanitizeInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
