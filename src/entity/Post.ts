import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  DeleteDateColumn, 
  ManyToOne, 
  JoinColumn, 
  OneToMany 
} from "typeorm"
import { User } from "./User";
import { Comment } from "./Comment";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string;
  
  @Column('longtext')
  content: string;

  @ManyToOne(() => User, user => user.posts)
  @JoinColumn()
  user: User;

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}