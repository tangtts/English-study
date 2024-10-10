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
import { SearchHistoryItemDto } from "./dto/search-history-item.dto";

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
  @Post("addOrUpdate")
  @PublicApi()
  async addOrUpdate(@Body() createItemDto: CreateItemDto) {
    return this.userService.addOrUpdate(createItemDto);
  }


  @ApiOperation({ summary: "查询历史列表" })
  @Get("getSearchHistoryList")
  @PublicApi()
  async getSearchList() {
    return this.userService.searchList();
  }


  
  @ApiOperation({ summary: "设置历史列表" })
  @Post("setSearchHistory")
  @PublicApi()
  async setSearch(@Body() searchHistoryItemDto: SearchHistoryItemDto) {
    return this.userService.setSearchHistory(searchHistoryItemDto);
  }

  

  

  @ApiOperation({ summary: "删除" })
  @Get("delete")
  @PublicApi()
  async delete(@Query("id", ParseIntPipe) id: number) {
    return this.userService.delete(id);
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
    if (!word) return [];
    return await this.userService.search(word);
  }

  @ApiOperation({ summary: "查询" })
  @PublicApi()
  @Get("searchByLetter")
  async searchByLetter(@Query("letter") letter: string) {
    return await this.userService.searchByLetter(letter);
  }

  @ApiOperation({ summary: "详情" })
  @PublicApi()
  @Get("detail")
  async detail(@Query("id", ParseIntPipe) id: number) {
    return await this.userService.detail(id);
  }

  @ApiOperation({ summary: "全部a-z" })
  @PublicApi()
  @Get("all")
  async all() {
    return await this.userService.getAll();
  }
}
