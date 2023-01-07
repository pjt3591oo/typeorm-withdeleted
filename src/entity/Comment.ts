import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  DeleteDateColumn, 
  ManyToOne 
} from "typeorm"
import { Post } from "./Post";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number

  @Column('longtext')
  content: string;

  @ManyToOne(() => Post, post => post.comments)
  post: Post;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}