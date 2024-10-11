import { JwtService } from '@nestjs/jwt';
import { Module } from "@nestjs/common";
import { UserService } from "./searchHistory.service";
import { SearchHistoryController } from "./searchHistory.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SearchItemEntity } from './entities/searchItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SearchItemEntity])],
  controllers: [SearchHistoryController],
  providers: [UserService],
  exports:[UserService],
}) 
export class UserModule {}
