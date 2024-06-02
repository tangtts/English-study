import { INestApplication, ValidationPipe } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { ConfigService } from "@nestjs/config";
import { setupSwagger } from "./utils/swagger";
import { TypeormFilter } from "./filters/typeorm.filter";
import { HttpExceptionFilter } from "./filters/http-exception.filter";
import { AllExceptionFilter } from "./filters/AllExceptionFilter.filter";
import { Config } from "./config/configType";

export const setupApp = (
  app: INestApplication,
  config: ConfigService<Config>
) => {
  const flag: boolean = config.get("LOG.ON", { infer: true }) === true;
  const nestWinston = app.get(WINSTON_MODULE_NEST_PROVIDER);
  flag && app.useLogger(nestWinston);
  app.setGlobalPrefix("api/v1");
  // 异常拦截写入日志,从右到左执行
  app.useGlobalFilters(
    flag && new AllExceptionFilter(nestWinston),
    new TypeormFilter(),
    new HttpExceptionFilter(nestWinston)
  );
  // 注册 Swagger 的配置顺序
  if (config.get("SWAGGER_ENABLE", { infer: true })) {
    setupSwagger(app);
  }
  // 全局拦截器
  app.useGlobalPipes(
    new ValidationPipe({
      // 去除在类上不存在的字段
      whitelist: true,
    })
  );
  // helmet头部安全
  app.use(helmet());

  // rateLimit限流
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minutes
      max: 300, // limit each IP to 100 requests per windowMs
    })
  );
};
