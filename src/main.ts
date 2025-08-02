import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(EnvService);
  const port = configService.get('PORT');

  app.use(bodyParser.json({
    verify: (req, _res, buf, _encoding) => {
      if (req.headers['x-shopify-hmac-sha256']) {
        (req as any).rawBody = buf.toString();
      }
      return true;
    },
  }));
  app.use(bodyParser.urlencoded({ extended: true }));

  await app.listen(port);
}
bootstrap();
