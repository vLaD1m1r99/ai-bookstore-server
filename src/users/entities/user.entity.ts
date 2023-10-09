import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { Rating } from '../../ratings/entities/rating.entity';
import * as bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';
import { Book } from 'src/books/entities/book.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  @IsEmail()
  email: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, length: 20 })
  name: string;

  @Column({ nullable: true })
  picture: string;

  @OneToMany(() => Rating, (rating) => rating.user, { cascade: true })
  ratings: Rating[];

  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  comments: Comment[];

  @ManyToMany(() => Book, (book) => book.users)
  @JoinTable()
  books: Book[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
