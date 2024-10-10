import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "./redis/redis.module";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import * as Joi from "joi";
import logger from "./middlewares/logger.middleware";
import { winstonConfig } from "./utils/winton";
import { ResponseFormatInterceptorInterceptor } from "./interceptors/response-format.interceptor";
import configuration from "./config";
import { Config } from "./config/configType";
import { EnglistItemEntity } from "./user/entities/item.entity";
const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production")
    .default("development"),
  MYSQL_SERVER_HOST: Joi.alternatives().try(
    Joi.string().ip(),
    Joi.string().domain()
  ),
  MYSQL_SERVER_PORT: Joi.number().port().default(3306),
  MYSQL_SERVER_USERNAME: Joi.string().default("root"),
  MYSQL_SERVER_PASSWORD: Joi.string().default("123456"),
  // 不能含有数字
  MYSQL_SERVER_DATABASE: Joi.string()
    .pattern(/\D{4,}/)
    .default("english"),
});
@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: schema,
      load: [
        () => {
          const values = configuration();
          const { error } = schema.validate(values?.parsed, {
            // 允许未知的环境变量
            allowUnknown: true,
            // 如果有错误，不要立即停止，而是收集所有错误
            abortEarly: false,
          });
          if (error) {
            throw new Error(
              `Validation failed - Is there an environment variable missing?
      ${error.message}`
            );
          }
          return values;
        },
      ],
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
          entities: [EnglistItemEntity],
          synchronize: true,
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
