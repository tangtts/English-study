import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, map } from "rxjs";
import { Response } from "express";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { getReqMainInfo } from "src/utils/getReqMainInfo";
import { Request } from 'express';
@Injectable()
export class ResponseFormatInterceptorInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    const statusCode = response.statusCode;
    const req = context.switchToHttp().getRequest<Request>();
    return next.handle().pipe(
      map(data => {
        this.logger.error('error', {
          responseData: data,
          req: getReqMainInfo(req),
        });
        if ([HttpStatus.OK, HttpStatus.CREATED].includes(statusCode)) {
          return {
            data,
            code: statusCode,
            message: "success",
          };
        } else {
          return {
            data: data.message,
            code: statusCode,
            message: "error",
          };
        }
      })
    );
  }
}
