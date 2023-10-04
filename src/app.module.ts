import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { BooksModule } from './books/books.module';
import { RatingsModule } from './ratings/ratings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    UsersModule,
    BooksModule,
    RatingsModule,
    CommentsModule,
    TypeOrmModule.forRoot(config),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
