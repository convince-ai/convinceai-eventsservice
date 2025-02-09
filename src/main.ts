import {
  BadRequestException,
  ValidationPipe,
  RequestMethod,
  ValidationError,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envVars } from './common/envs';
import * as bodyParser from 'body-parser';
import { GlobalExceptionFilter } from './system/filters/global-exception.filter';
//import { JwtInterceptor } from './system/interceptors/jwt.interceptor';

async function bootstrap() {
  const port = envVars.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  app.enableCors();
  app.useGlobalFilters(new GlobalExceptionFilter());
  //app.useGlobalInterceptors(new JwtInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      validateCustomDecorators: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException(errors);
      },
    }),
  );

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  await app.listen(port);
}

process.on('unhandledRejection', (reason) => {
  console.log(`Unhandled Rejection at: ${reason}`);
});

bootstrap();
