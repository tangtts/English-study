import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateWordDto } from "./dto/CreateItem.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { wordBookEntity } from "./entities/wordBook.entity";
import { Like, Repository } from "typeorm";
import * as tencentcloud from "tencentcloud-sdk-nodejs-tmt";
import { TranslateItemDto } from "./dto/TranslateItem.dto";
import { SearchItemDto } from "./dto/SearchItem.dto";
import { ExampleEntity } from './entities/example.entity';
import { ConfigService } from "@nestjs/config";
import { Config } from "src/config/configType";
import { SearchHistoryService } from "src/searchHistory/searchHistory.service";
const TmtClient = tencentcloud.tmt.v20180321.Client;

@Injectable()
export class WordBookService {

  @InjectRepository(wordBookEntity)
  private readonly wordBookRepository: Repository<wordBookEntity>;

  @InjectRepository(ExampleEntity)
  private readonly exampleRepository: Repository<ExampleEntity>;

  @Inject()
  private readonly searchHistoryService: SearchHistoryService;


  private client: any;
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    this.client = new TmtClient({
      credential: {
        secretId: this.configService.get("TENCENT_CLOUD.SECRET_ID"),
        secretKey: this.configService.get("TENCENT_CLOUD.SECRET_KEY"),
      },
      region: "ap-beijing",
      profile: {
        httpProfile: {
          endpoint: "tmt.tencentcloudapi.com",
        },
      },
    });
  }

  // 翻译文本，暂时只支持英文到中文
  async translate(translateItemDto: TranslateItemDto) {
    let r1 = await this.client.TextTranslate({
      SourceText: translateItemDto.sourceText,
      Source: translateItemDto.sourceLanguage || "en",
      Target: translateItemDto.target || "zh",
      ProjectId: 0,
    })
    this.searchHistoryService.setSearchHistory({
      zhCh: translateItemDto.sourceText,
      en: r1.TargetText
    })

    return r1.TargetText;
  }

  async addOrUpdate(createItemDto: CreateWordDto) {
    // 说明是更新
    if (createItemDto.id) {
      // 使用事务
      const { id, examples, ...value } = createItemDto;
      await this.exampleRepository.manager.transaction(async transactionalEntityManager => {
        await transactionalEntityManager.delete(ExampleEntity, { wordId: id });
        const examplesToInsert = examples.map(content => ({
          content,
          wordId: id,
        }));

        // 批量插入例子
        if (examplesToInsert.length > 0) {
          await transactionalEntityManager.insert(ExampleEntity, examplesToInsert);
        }

        // 更新其他字段
        await this.wordBookRepository.update(id, value)
      })
    } else {
      // 判断是否存在同名
      const exist = await this.wordBookRepository.findOne({
        where: {
          sourceText: createItemDto.sourceText,
        },
      });
      if (exist) {
        throw new HttpException("已存在", HttpStatus.BAD_REQUEST);
      }
      let r = await this.wordBookRepository.save(createItemDto);

      // 进行关联
      createItemDto.examples.forEach(item => {
        let example = new ExampleEntity;
        example.content = item;
        example.wordId = r.id;
        this.exampleRepository.save(example);
      });
      return "success"
    }
  }

  async delete(id: number) {
    return await this.wordBookRepository.update(id, {
      isDeleted: true,
    });
  }

  async search(word: string) {
    let r = await this.wordBookRepository.find({
      where: {
        sourceText: Like(`%${word}%`),
      },
    });
    return r;
  }

  async getListBySearch(searchItemDto: SearchItemDto) {
    return await this.wordBookRepository.find({
      where: {
        isDeleted: false,
      },
      skip: (searchItemDto.pageNum - 1) * searchItemDto.pageSize,
      take: searchItemDto.pageSize,
    });
  }

  async detail(id: number) {
    let r = await this.wordBookRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
    }) as any;

    let x = await this.exampleRepository.findBy({ wordId: id, isDeleted: false, })
    r.examples = x.map(item => item.content);
    return r;
  }

  async searchByLetter(letter: string) {
    let r = await this.wordBookRepository.find({
      where: {
        isDeleted: false,
      },
    });
    return r.filter(item => item.sourceText[0] === letter)
  }

  async getAllLetter() {
    // 根据 a-z开头，并且获取他们的数量
    let r = await this.wordBookRepository.find({
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
