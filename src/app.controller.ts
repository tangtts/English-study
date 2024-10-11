import {
  Controller,
  Get
} from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags } from "@nestjs/swagger";
@ApiTags("APP_GUARD模块")
@Controller("/")
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get("")
  test() {
    return "success!"
  }
}
