import {
  Controller
} from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags } from "@nestjs/swagger";


@ApiTags("基础模块")
@Controller("/")
export class AppController {
  constructor(private readonly appService: AppService) {}
}
