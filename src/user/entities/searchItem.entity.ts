
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("search")
export class SearchItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: "中文",
  })
  zhCh: string;

  @Column({
    comment: "英文",
  })
  en: string;


  @Column({ default: false, comment: "是否删除", select: false })
  isDeleted: boolean;

  @CreateDateColumn({
    comment: "创建时间",
    select: false,
  })
  createdTime: Date;
}
