import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { IsStringAndNotEmpty } from "src/customDecorator";

export class TranslateItemDto {
  @ApiProperty({
    description: "源文本",
    example: "你好",
  })
  @IsStringAndNotEmpty()
  sourceText: string;

  @ApiProperty({
    description: "源语言",
    example: "zh",
    default: "zh",
    enum: ["zh", "en"],
  })
  @IsOptional()
  @IsEnum(["zh", "en"])
  sourceLanguage: string = "zh";

  @ApiProperty({
    example: "en",
    description: "目标语言",
    enum: ["zh", "en"],
  })
  @IsOptional()
  @IsEnum(["zh", "en"])
  target: string = "en";
}
