import { RedisService } from "./../redis/redis.service";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateWordDto } from "./dto/CreateItem.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { wordBookEntity } from "./entities/wordBook.entity";
import { Like, Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Config } from "../config/configType";
import * as tencentcloud from "tencentcloud-sdk-nodejs-tmt";
import { TranslateItemDto } from "./dto/TranslateItem.dto";
import { SearchItemDto } from "./dto/SearchItem.dto";
import { SearchHistoryItemDto } from "./dto/search-history-item.dto";
import { ExampleEntity } from './entities/example.entity';
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

  @InjectRepository(wordBookEntity)
  private readonly englishRepository: Repository<wordBookEntity>;

  @InjectRepository(ExampleEntity)
  private readonly exampleRepository: Repository<ExampleEntity>;

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

  async delSearchHistoryItem(id: number) {
    await this.searchRepository.update(id, {
      isDeleted: true
    })
  }

  async setSearchHistory(searchHistoryItemDto: SearchHistoryItemDto) {
    let searchHistoryItem = new SearchItemEntity;
    searchHistoryItem.zhCh = searchHistoryItemDto.zhCh;
    searchHistoryItem.en = searchHistoryItemDto.en;
    // searchHistoryItem.createdTime = new Date();
    return await this.searchRepository.save(searchHistoryItem);
  }

  // 翻译文本，暂时只支持英文到中文
  async translate(translateItemDto: TranslateItemDto) {
    let r1 = await this.client.TextTranslate({
      SourceText: translateItemDto.sourceText,
      Source: translateItemDto.sourceLanguage || "en",
      Target: translateItemDto.target || "zh",
      ProjectId: 0,
    })
    return r1.TargetText;
  }

  async addOrUpdate(createItemDto: CreateWordDto) {
    // 说明是更新
    if (createItemDto.id) {
      // 更新其他字段
      await this.englishRepository.update(createItemDto.id, createItemDto)
      // 删除所有例子
      await this.exampleRepository.delete({
        wordId: createItemDto.id
      });
      // 添加例子
      createItemDto.examples.forEach(item => {
        let example = new ExampleEntity;
        example.content = item;
        example.wordId = createItemDto.id;
        this.exampleRepository.save(example);
      });
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
      // 进行关联
      createItemDto.examples.forEach(item => {
        let example = new ExampleEntity;
        example.content = item;
        example.wordId = createItemDto.id;
        this.exampleRepository.save(example);
      });
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
