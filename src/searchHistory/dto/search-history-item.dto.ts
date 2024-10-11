import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";


export class SearchHistoryItemDto {
  @IsString()
  zhCh: string;

  @IsString()
  en: string;
}