import { JwtService } from '@nestjs/jwt';
import { Module } from "@nestjs/common";
import { SearchHistoryController } from "./searchHistory.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SearchItemEntity } from './entities/searchItem.entity';
import { SearchHistoryService } from './searchHistory.service';

@Module({
  imports: [TypeOrmModule.forFeature([SearchItemEntity])],
  controllers: [SearchHistoryController],
  providers: [SearchHistoryService],
  exports:[SearchHistoryService],
}) 
export class SearchHistoryModule {}
