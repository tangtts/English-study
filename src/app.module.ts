import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import logger from "./middlewares/logger.middleware";
import { winstonConfig } from "./utils/winton";
import { ResponseFormatInterceptorInterceptor } from "./interceptors/response-format.interceptor";
import configuration from "./config";
import { Config } from "./config/configType";
import { ExampleEntity } from "./wordbook/entities/example.entity";
import { wordBookEntity } from "./wordbook/entities/wordBook.entity";
import { SearchHistoryModule } from "./searchHistory/searchHistory.module";
import { WordBookModule } from "./wordbook/wordBook.module";
import { SearchItemEntity } from "./searchHistory/entities/searchItem.entity";

@Module({
  imports: [
    SearchHistoryModule,
    WordBookModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load:[configuration],
    }),
    
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config>) => {
        return {
          secret: configService.get("JWT.SECRET", { infer: true }),
          signOptions: {
            expiresIn: configService.get("JWT.ACCESS_TOKEN_EXPIRES_TIME", {
              infer: true,
            }),
          },
        };
      },
    }),
    
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config>) => {
        return {
          type: "mysql",
          host: configService.get("MYSQL.HOST", { infer: true }),
          port: configService.get("MYSQL.PORT", { infer: true }),
          username: configService.get("MYSQL.USERNAME", { infer: true }),
          password: configService.get("MYSQL.PASSWORD", { infer: true }),
          database: configService.get("MYSQL.DATABASE", { infer: true }),
          entities: [SearchItemEntity,ExampleEntity,wordBookEntity],
          synchronize: false,
          logging: configService.get("MYSQL.LOG_ON", { infer: true }),
          connectorPackage: "mysql2",
        };
      },
    }),
    winstonConfig(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseFormatInterceptorInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 应用全局中间件
    consumer.apply(logger).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
