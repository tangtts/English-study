import { Module } from "@nestjs/common";
import { WordBookController } from "./wordBook.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { wordBookEntity } from './entities/wordBook.entity';
import { WordBookService } from './wordBook.service';
import { ExampleEntity } from "./entities/example.entity";
import { SearchHistoryService } from "src/searchHistory/searchHistory.service";
import { SearchHistoryController } from "src/searchHistory/searchHistory.controller";
import { SearchHistoryModule } from "src/searchHistory/searchHistory.module";

@Module({
  imports: [TypeOrmModule.forFeature([wordBookEntity,ExampleEntity]),SearchHistoryModule],
  controllers: [WordBookController],
  providers: [WordBookService],
  exports:[WordBookService,],
}) 
export class WordBookModule {}
