import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  UploadedFile,
  Get,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ensureDir } from "fs-extra";
import { diskStorage } from "multer";
import * as path from "path";
import { PublicApi } from "src/customDecorator";

@ApiTags("基础模块")
@Controller("/")
export class AppController {
  constructor(private readonly appService: AppService) {}
}
