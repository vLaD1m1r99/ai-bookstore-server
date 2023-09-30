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

  @Get('/comments/:id')
  findAllByBook(@Param('id') id: string) {
    return this.booksService.findAllComments(id);
  }
}
