import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { setupApp } from './setup';
import { Config } from 'config/configType';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{
    cors: true
  });

  const configService = app.get(ConfigService<Config>)
  
  setupApp(app,configService)

  // 默认是 static 目录,可以修改为 my-uploads
  app.useStaticAssets('my-uploads',{prefix:'/static/'})
  console.log(configService.get("NSET.PORT",{infer:true}));
  await app.listen(configService.get("NSET.PORT",{infer:true}));
}

bootstrap();
