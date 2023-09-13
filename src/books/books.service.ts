import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  private books = [
    { id: 0, title: 'Test1', image: 'img' },
    { id: 1, title: 'Test2', image: 'img' },
  ];
  create(createBookDto: CreateBookDto) {
    // return 'This action adds a new book';
    const newBook = {
      ...createBookDto,
      id: 2,
    };
    this.books.push(newBook);
    return newBook;
  }

  findAll() {
    // return `This action returns all books`;
    return this.books;
  }

  findOne(id: number) {
    // return `This action returns a #${id} book`;
    const book = this.books.find((book) => book.id === id);
    if (!book) throw new Error('Book not found!');
    return book;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    // return `This action updates a #${id} book`;
    this.books = this.books.map((book) => {
      if (book.id === id) {
        return { ...book, ...updateBookDto };
      }
      return book;
    });
  }

  remove(id: number) {
    // return `This action removes a #${id} book`;
    const toBeRemoved = this.findOne(id);
    this.books = this.books.filter((book) => book.id !== id);
    return toBeRemoved;
  }
}
