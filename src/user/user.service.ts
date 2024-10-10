import { RedisService } from "./../redis/redis.service";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateItemDto } from "./dto/CreateItem.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { EnglistItemEntity } from "./entities/item.entity";
import { Like, Repository } from "typeorm";
import { encryptByMD5 } from "src/utils";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Config } from "../config/configType";
import * as tencentcloud from "tencentcloud-sdk-nodejs-tmt";
import { TranslateItemDto } from "./dto/TranslateItem.dto";
import { SearchItemDto } from "./dto/SearchItem.dto";
import { SearchItemEntity } from "./entities/searchItem.entity";
import { SearchHistoryItemDto } from "./dto/search-history-item.dto";
const TmtClient = tencentcloud.tmt.v20180321.Client;
const clientConfig = {
  credential: {
    secretId: "AKIDGT3d3XhsAOjvtwqlkePxMYbYbYJGMZqA",
    secretKey: "MZlniXJwQo4DHtQ7iGpT0gH0ZzFPNAkB",
  },
  region: "ap-beijing",
  profile: {
    httpProfile: {
      endpoint: "tmt.tencentcloudapi.com",
    },
  },
};

@Injectable()
export class UserService {


  // 使用写在这里就相当于 this 注入了

  @InjectRepository(EnglistItemEntity)
  private readonly englishRepository: Repository<EnglistItemEntity>;

  @InjectRepository(SearchItemEntity)
  private readonly searchRepository: Repository<SearchItemEntity>;

  private client: any;
  constructor() {
    this.client = new TmtClient(clientConfig);
  }

  async searchList() {
    return this.searchRepository.find({
      where: {
        isDeleted: false,
      },
    })
  }

  async setSearchHistory(searchHistoryItemDto: SearchHistoryItemDto) {
    let searchHistoryItem = new SearchItemEntity;
    searchHistoryItem.zhCh = searchHistoryItemDto.zhCh;
    searchHistoryItem.en = searchHistoryItemDto.en;
    // searchHistoryItem.createdTime = new Date();
    return await this.searchRepository.save(searchHistoryItem);
  }

  async translate(translateItemDto: TranslateItemDto) {
    let r1 = await this.client.TextTranslate({
      SourceText: translateItemDto.sourceText,
      Source: translateItemDto.sourceLanguage || "en",
      Target: translateItemDto.target || "zh",
      ProjectId: 0,
    })
    return r1.TargetText;
  }

  async addOrUpdate(createItemDto: CreateItemDto) {
    if (createItemDto.id) {
      return await this.englishRepository.update(createItemDto.id, createItemDto)
    } else {
      // 判断是否存在同名
      const exist = await this.englishRepository.findOne({
        where: {
          sourceText: createItemDto.sourceText,
        },
      });
      if (exist) {
        throw new HttpException("已存在", HttpStatus.BAD_REQUEST);
      }
      return await this.englishRepository.save(createItemDto);
    }
  }

  async delete(id: number) {
    return await this.englishRepository.update(id, {
      isDeleted: true,
    });
  }

  async search(word: string) {
    let r = await this.englishRepository.find({
      where: {
        sourceText: Like(`%${word}%`),
      },
    });
    return r;
  }

  async getListBySearch(searchItemDto: SearchItemDto) {
    return await this.englishRepository.find({
      where: {
        isDeleted: false,
      },
      skip: (searchItemDto.pageNum - 1) * searchItemDto.pageSize,
      take: searchItemDto.pageSize,
    });
  }

  async detail(id: number) {
    return await this.englishRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    });
  }

  async searchByLetter(letter: string) {
    let r = await this.englishRepository.find({
      where: {
        isDeleted: false,
      },
    });
    return r.filter(item => item.sourceText[0] === letter)
  }

  async getAll() {
    // 根据 a-z开头，并且获取他们的数量
    let r = await this.englishRepository.find({
      where: {
        isDeleted: false,
      },
    });

    let x = {};
    const aCharCode = 97;
    const zCharCode = 122;
    // 创建一个对象，用来存储每个字母的数据
    // { a:[count:0,data:[]],b:[count:0,data:[] }
    for (let i = aCharCode; i <= zCharCode; i++) {
      x[String.fromCharCode(i)] = {
        data: [],
        count: 0,
      };
    }
    r.forEach(item => {
      const firstLetter = item.sourceText[0];
      if (x[firstLetter]) {
        x[firstLetter].data.push(item);
        x[firstLetter].count++;
      }
    });
    return x;
  }
}
