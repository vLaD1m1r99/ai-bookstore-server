import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(
    @Body()
    userId: string,
    createBookDto: CreateBookDto,
  ) {
    return this.booksService.create(userId, createBookDto);
  }

  @Get()
  findAllByUser(@Param('userId') userId: string) {
    return this.booksService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.booksService.findOne(id);
    } catch (error) {
      throw new NotFoundException(`Book not found!`);
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() userId: string,
    updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(userId, id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }

  @Post('add-to-user/:userId/:bookId')
  async addBookToUser(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ): Promise<User> {
    return await this.booksService.addBookToUser(userId, bookId);
  }
}
