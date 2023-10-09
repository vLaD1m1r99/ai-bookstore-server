import { Comment } from 'src/comments/entities/comment.entity';
import { Book } from 'src/books/entities/book.entity';
import { Rating } from 'src/ratings/entities/rating.entity';
import { User } from 'src/users/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  database: 'ai_bookstore',
  host: 'localhost',
  port: 5432,
  username: 'vlada',
  password: 'Mezebavas99!',
  entities: [User, Comment, Book, Rating],
  synchronize: true,
};

export default config;
