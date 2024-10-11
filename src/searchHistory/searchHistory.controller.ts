import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { UserService as SearchHistoryService } from "./searchHistory.service";
import { PublicApi, RequireLogin, UserInfo } from "src/customDecorator";
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { Config } from "../config/configType";
import { SearchHistoryItemDto } from "./dto/search-history-item.dto";

@ApiTags("模块")
@Controller("/searchHistory")
export class SearchHistoryController {
  @Inject()
  private readonly searchHistoryService: SearchHistoryService;

  @ApiOperation({ summary: "查询搜索历史列表" })
  @Get("list")
  @PublicApi()
  async getSearchList() {
    return this.searchHistoryService.searchList();
  }


  @ApiOperation({ summary: "删除历史项" })
  @Post("del")
  @PublicApi()
  async delSearchHistoryItem(@Body("id") id: number) {
    return this.searchHistoryService.delSearchHistoryItem(id);
  }


  @ApiOperation({ summary: "设置历史列表" })
  
  @Post("setSearchHistory")
  @PublicApi()
  async setSearch(@Body() searchHistoryItemDto: SearchHistoryItemDto) {
    return this.searchHistoryService.setSearchHistory(searchHistoryItemDto);
  }

  // @ApiOperation({ summary: "查询" })
  // @PublicApi()
  // @Post("search")
  // async get(@Body("word") word) {
  //   if (!word) return [];
  //   return await this.searchHistoryService.search(word);
  // }



}
