import { JwtService } from '@nestjs/jwt';
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnglistItemEntity } from './entities/item.entity';
import { SearchItemEntity } from './entities/searchItem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EnglistItemEntity,SearchItemEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService],
}) 
export class UserModule {}
