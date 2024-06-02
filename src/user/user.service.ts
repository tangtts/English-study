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
import * as tencentcloud from "tencentcloud-sdk-nodejs-common";
import { CommonClient } from "tencentcloud-sdk-nodejs-common";
import { TranslateItemDto } from "./dto/TranslateItem.dto";
import { SearchItemDto } from "./dto/SearchItem.dto";

@Injectable()
export class UserService {
  // 使用写在这里就相当于 this 注入了

  @InjectRepository(EnglistItemEntity)
  private readonly englishRepository: Repository<EnglistItemEntity>;
  @Inject()
  private configService: ConfigService<Config>;

  client: CommonClient = null;

  async translate(translateItemDto: TranslateItemDto) {
    let r = await this.client.request("TextTranslate", {
      SourceText: translateItemDto.sourceText,
      Source: translateItemDto.sourceLanguage || "zh",
      Target: translateItemDto.target || "en",
      ProjectId: 0,
    });
    return r.TargetText;
  }

  async add(createItemDto: CreateItemDto) {
    return await this.englishRepository.save(createItemDto);
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

  async getAll() {
    // 根据 a-z开头，并且获取他们的数量
    let r = await this.englishRepository.find({
      where: {
        isDeleted: false,
      },
    });
    let x = {};
    for (let i = 97; i < 123; i++) {
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
