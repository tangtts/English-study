

interface NestConfig {
  PORT:number
}

interface MysqlConfig {
  DATABASE: string;
  PORT: number;
  HOST: string;
  USERNAME: string;
  PASSWORD: string;
}

interface RedisConfig {
  HOST: string;
  PORT: number;
  DB: string;
  REGISTER_CODE: string;
  USERNAME: string;
  PASSWORD: string;
}

interface JwtConfig {
  SECRET: string;
  ACCESS_TOKEN_EXPIRES_TIME: string;
  REFRESH_TOKEN_EXPIRES_TIME: string;
}

interface LogConfig {
  ON: boolean;
}

export interface Config {
  NSET:NestConfig;
  MYSQL: MysqlConfig;
  REDIS: RedisConfig;
  JWT: JwtConfig;
  LOG: LogConfig;
  SWAGGER_ENABLE: boolean;
}