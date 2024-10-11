import { Exclude, Expose } from "class-transformer";

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ExampleEntity } from "./example.entity";

// 单词本
@Entity("wordbook")
export class wordBookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: "源文件",
  })
  sourceText: string;

  @Column({
    comment: "翻译文本",
  })
  transformText: string;

  @Column({ default: false, comment: "是否删除", select: false })
  isDeleted: boolean;

  @CreateDateColumn({
    comment: "创建时间",
    select: false,
  })
  createdTime: Date;

  @UpdateDateColumn({
    comment: "更新时间",
    select: false,
  })
  updateTime: Date;
}
