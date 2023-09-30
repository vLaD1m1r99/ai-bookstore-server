import { Module, forwardRef } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { CommentsModule } from 'src/comments/comments.module';
import { RatingsModule } from 'src/ratings/ratings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    RatingsModule,
    UsersModule,
    forwardRef(() => CommentsModule),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService, TypeOrmModule.forFeature([Book])],
})
export class BooksModule {}
