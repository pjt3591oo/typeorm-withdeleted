import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany
} from "typeorm"
import { Post } from "./Post";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  age: number

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
