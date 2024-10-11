

interface NestConfig {
  PORT:number
  TENCENTCLOUD_SECRETID: string
  TENCENTCLOUD_SECRETKEY: string
}

interface MysqlConfig {
  DATABASE: string;
  PORT: number;
  HOST: string;
  USERNAME: string;
  PASSWORD: string;
  LOG_ON:boolean
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
  NEST:NestConfig;
  MYSQL: MysqlConfig;
  REDIS: RedisConfig;
  JWT: JwtConfig;
  LOG: LogConfig;
  SWAGGER_ENABLE: boolean;

  TENCENT_CLOUD: {
    SECRET_ID: string;
    SECRET_KEY: string;
  };
}