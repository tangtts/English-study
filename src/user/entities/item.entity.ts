import { Exclude, Expose } from "class-transformer";

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("englishlist")
export class EnglistItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    comment: "源文件",
  })
  sourceText: string;

  @Column()
  transformText: string;

  @Column({type: "simple-array", comment: "例子" })
  examples: string[] = [];

  @Column({ default: "" })
  sourceOrigin: string;

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
