import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Rating } from '../../ratings/entities/rating.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';

export type BookGenres = (
  | 'horror'
  | 'mystery'
  | 'romance'
  | 'science-fiction'
  | 'fantasy'
)[];

@Entity('Books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false, length: 50 })
  title: string;

  @Column({ length: 250 })
  description: string;

  @Column('simple-array', { default: [], array: true })
  genre: BookGenres;

  @OneToMany(() => Rating, (rating) => rating.book, { cascade: true })
  ratings: Rating[];

  // Add a getter method for averageRating
  get averageRating(): number | null {
    if (!this.ratings || this.ratings.length === 0) {
      return null;
    }

    const sum = this.ratings.reduce((total, rating) => total + rating.value, 0);
    return sum / this.ratings.length;
  }

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  image: string;

  @Column({ unique: true, nullable: false, length: 50 })
  pdf: string;

  @Column({ nullable: true })
  audio: string;

  @OneToMany(() => Comment, (comment) => comment.book, { cascade: true })
  comments: Comment[];

  @ManyToMany(() => User, (user) => user.books)
  users: User[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
