import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { UserService as WordBookService } from "./wordBook.service";
import { CreateWordDto } from "./dto/CreateItem.dto";
import { PublicApi, RequireLogin, UserInfo } from "src/customDecorator";
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { Config } from "../config/configType";
import { TranslateItemDto } from "./dto/TranslateItem.dto";
import { SearchItemDto } from "./dto/SearchItem.dto";
import { SearchHistoryItemDto } from "./dto/search-history-item.dto";

@ApiTags("单词本模块")
@Controller("/wordbook")
export class WordBookController {
  @Inject()
  private readonly wordBookService: WordBookService;

  /**
   * @description  翻译文本，暂时只支持英文到中文
   * @param {TranslateItemDto} translateItemDto
   */
  @ApiOperation({ summary: "翻译单词" })
  @ApiBody({ type: CreateWordDto })
  @PublicApi()
  @Post("translate")
  async translate(@Body() translateItemDto: TranslateItemDto) {
    return this.wordBookService.translate(translateItemDto);
  }

  @ApiOperation({ summary: "新增或者修改单词" })
  @ApiBody({ type: CreateWordDto })
  @Post("addOrUpdate")
  @PublicApi()
  async addOrUpdate(@Body() createItemDto: CreateWordDto) {
    return this.wordBookService.addOrUpdate(createItemDto);
  }


  @ApiOperation({ summary: "查询历史列表" })
  @Get("getSearchHistoryList")
  @PublicApi()
  async getSearchList() {
    return this.wordBookService.searchList();
  }


  @ApiOperation({ summary: "删除历史项" })
  @Post("delSearchHistoryItem")
  @PublicApi()
  async delSearchHistoryItem(@Body("id") id: number) {
    return this.wordBookService.delSearchHistoryItem(id);
  }


  @ApiOperation({ summary: "设置历史列表" })
  @Post("setSearchHistory")
  @PublicApi()
  async setSearch(@Body() searchHistoryItemDto: SearchHistoryItemDto) {
    return this.wordBookService.setSearchHistory(searchHistoryItemDto);
  }





  @ApiOperation({ summary: "删除" })
  @Get("delete")
  @PublicApi()
  async delete(@Query("id", ParseIntPipe) id: number) {
    return this.wordBookService.delete(id);
  }

  @ApiOperation({ summary: "列表" })
  @ApiBody({ type: SearchItemDto })
  @Post("list")
  @PublicApi()
  async list(@Body() searchItemDto: SearchItemDto) {
    return this.wordBookService.getListBySearch(searchItemDto);
  }

  @ApiOperation({ summary: "查询" })
  @PublicApi()
  @Post("search")
  async get(@Body("word") word) {
    if (!word) return [];
    return await this.wordBookService.search(word);
  }

  @ApiOperation({ summary: "查询" })
  @PublicApi()
  @Get("searchByLetter")
  async searchByLetter(@Query("letter") letter: string) {
    return await this.wordBookService.searchByLetter(letter);
  }

  @ApiOperation({ summary: "详情" })
  @PublicApi()
  @Get("detail")
  async detail(@Query("id", ParseIntPipe) id: number) {
    return await this.wordBookService.detail(id);
  }

  @ApiOperation({ summary: "全部a-z" })
  @PublicApi()
  @Get("all")
  async all() {
    return await this.wordBookService.getAll();
  }
}
