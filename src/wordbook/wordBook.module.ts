import { JwtService } from '@nestjs/jwt';
import { Module } from "@nestjs/common";
import { UserService } from "./wordBook.service";
import { WordBookController } from "./wordBook.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { wordBookEntity } from './entities/wordBook.entity';

@Module({
  imports: [TypeOrmModule.forFeature([wordBookEntity])],
  controllers: [WordBookController],
  providers: [UserService],
  exports:[UserService],
}) 
export class UserModule {}
