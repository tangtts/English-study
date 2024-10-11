import { Injectable } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SearchItemEntity } from "./entities/searchItem.entity";
import { SearchHistoryItemDto } from "./dto/search-history-item.dto";


@Injectable()
export class SearchHistoryService {

  @InjectRepository(SearchItemEntity)
  private readonly searchRepository: Repository<SearchItemEntity>;

  async searchList() {
    return this.searchRepository.find({
      where: {
        isDeleted: false,
      },
    })
  }

  async delSearchHistoryItem(id: number) {
    await this.searchRepository.update(id, {
      isDeleted: true
    })
  }

  async setSearchHistory(searchHistoryItemDto: SearchHistoryItemDto) {
    let searchHistoryItem = new SearchItemEntity;
    searchHistoryItem.zhCh = searchHistoryItemDto.zhCh;
    searchHistoryItem.en = searchHistoryItemDto.en;
    return await this.searchRepository.save(searchHistoryItem);
  }
}
