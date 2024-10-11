import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
} from "@nestjs/common";
import {  SearchHistoryService } from "./searchHistory.service";
import { PublicApi } from "src/customDecorator";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { SearchHistoryItemDto } from "./dto/search-history-item.dto";

@ApiTags("搜索历史模块")
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
}
