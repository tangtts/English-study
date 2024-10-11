import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, isString } from "class-validator";
import { IsStringAndNotEmpty } from "src/customDecorator";

export class SearchItemDto {
  @ApiProperty({
    description: "当前页码",
    example: "1",
    default:1
  })
  @IsNumber()
  pageNum: number = 1;

  @ApiProperty({
    description: "页数",
    example: "10",
    default:10
  })
  @IsNumber()
  pageSize: number = 10;
}
