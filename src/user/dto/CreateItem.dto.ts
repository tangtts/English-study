import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString, isString } from "class-validator";
import { IsStringAndNotEmpty } from "src/customDecorator";

export class CreateItemDto {
  @ApiProperty({
    description: "源文本",
    example: "你好",
  })
  @IsStringAndNotEmpty()
  sourceText: string;

  @ApiProperty({
    description: "翻译文本",
    example: "hello",
  })
  @IsStringAndNotEmpty()
  transformText: string;

  @ApiProperty({
    description: "举例说明",
    default: "hello",
  })
  @IsOptional()
  @IsArray()
  examples: string[];

  @ApiProperty({
    example: "",
    description: "来源",
  })
  @IsOptional()
  @IsString()
  sourceOrigin: string;

  @ApiProperty({
    example: "",
    description: "重要性",
    default: 1,
  })
  star: number = 1;
}
