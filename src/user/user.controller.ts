import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateItemDto } from "./dto/CreateItem.dto";
import { PublicApi, RequireLogin, UserInfo } from "src/customDecorator";
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { Config } from "../config/configType";
import { TranslateItemDto } from "./dto/TranslateItem.dto";
import { SearchItemDto } from "./dto/SearchItem.dto";

@ApiTags("模块")
@Controller("/")
export class UserController {
  @Inject()
  private readonly userService: UserService;
  @Inject()
  private configService: ConfigService<Config>;

  @ApiOperation({ summary: "翻译" }) 
  @ApiBody({ type: CreateItemDto })
  @PublicApi()
  @Post("translate")
  async translate(@Body() translateItemDto: TranslateItemDto) {
    return this.userService.translate(translateItemDto);
  }

  @ApiOperation({ summary: "新增" })
  @ApiBody({ type: CreateItemDto })
  @Post("add")
  @PublicApi()
  async add(@Body() createItemDto: CreateItemDto) {
    return this.userService.add(createItemDto);
  }

  @ApiOperation({ summary: "列表" })
  @ApiBody({ type: SearchItemDto })
  @Post("list")
  @PublicApi()
  async list(@Body() searchItemDto: SearchItemDto) {
    return this.userService.getListBySearch(searchItemDto);
  }

  @ApiOperation({ summary: "查询" })
  @PublicApi()
  @Post("search")
  async get(@Body("word") word) {
    return await this.userService.search(word);
  }

  @ApiOperation({ summary: "详情" })
  @PublicApi()
  @Get("detail")
  async detail(@Query("id", ParseIntPipe) id) {
    return await this.userService.detail(id);
  }

  @ApiOperation({ summary: "全部a-z" })
  @PublicApi()
  @Get("all")
  async all() {
    return await this.userService.getAll();
  }
}
