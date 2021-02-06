import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export async function bootstrap(app: INestApplication) {
  app.enableCors();

  enableSwagger(app);
}
function enableSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Gestão Normas')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
