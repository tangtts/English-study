import { Exclude, Expose } from "class-transformer";

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

// 例子
@Entity("example")
export class ExampleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: "关联的单词id",
  })
  wordId: number;

  @Column({
    comment: "例子内容",
  })
  content: string;

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
