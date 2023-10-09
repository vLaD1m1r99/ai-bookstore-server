import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { join } from 'path';
@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {}

  async findImage(id: string, res): Promise<void> {
    const book = await this.bookRepo.findOne({ where: { id } });
    if (book.image) {
      return res.sendFile(
        join(process.cwd(), `uploads/bookUploads/${book.image}`),
      );
    } else {
      return null;
    }
  }

  async findPDF(id: string, res): Promise<void> {
    const book = await this.bookRepo.findOne({ where: { id } });
    if (book.pdf) {
      return res.sendFile(
        join(process.cwd(), `uploads/bookUploads/${book.pdf}`),
      );
    } else {
      return null;
    }
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepo.findOne({
      relations: ['users', 'ratings'],
      where: { id },
    });
    if (!book) {
      throw new NotFoundException(`Book not found!`);
    }
    const averageRating = book.averageRating;
    const bookResponse = { ...book, averageRating };
    return bookResponse;
  }

  async findAll(): Promise<Book[]> {
    const books = await this.bookRepo.find();
    if (!books) {
      throw new NotFoundException(`Book not found!`);
    }
    return books;
  }

  async create(
    files: { image?: Express.Multer.File[]; pdf?: Express.Multer.File[] },
    createBookDto: CreateBookDto,
  ): Promise<Book> {
    const pdf = files.pdf[0].originalname;
    const image = files.image[0].originalname;
    const { title, description, author } = createBookDto;
    if (!title || !description || !pdf) {
      throw new HttpException(
        'Title, description, and pdf are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const user = await this.userRepo.findOne({
        where: { id: createBookDto.userId },
      });

      if (!user) {
        throw new NotFoundException(`User not found!`);
      }

      const book = this.bookRepo.create({
        title,
        author,
        description,
        pdf,
        image,
      });
      book.users = [user];

      return await this.bookRepo.save(book);
    } catch (error) {
      console.error('Error creating book:', error.message, error.stack);
      throw new HttpException(
        'Error creating book',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    userId: string,
    bookId: string,
    updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['books'],
    });

    if (!user) {
      throw new NotFoundException(`User not found!`);
    }

    const bookToUpdate = user.books.find((book) => book.id === bookId);

    if (!bookToUpdate) {
      throw new NotFoundException(
        `Book not found or does not belong to the user!`,
      );
    }

    if (updateBookDto.title) {
      bookToUpdate.title = updateBookDto.title;
    }
    if (updateBookDto.description) {
      bookToUpdate.description = updateBookDto.description;
    }
    if (updateBookDto.genre) {
      bookToUpdate.genre = updateBookDto.genre;
    }
    if (updateBookDto.author) {
      bookToUpdate.author = updateBookDto.author;
    }
    if (updateBookDto.audio) {
      bookToUpdate.audio = updateBookDto.audio;
    }

    return await this.bookRepo.save(bookToUpdate);
  }

  async remove(id: string): Promise<Book> {
    const book = await this.findOne(id);
    if (!book) {
      throw new NotFoundException(`Book not found!`);
    }
    return await this.bookRepo.remove(book);
  }

  async findAllComments(id: string): Promise<Comment[]> {
    const book = await this.bookRepo.findOne({
      relations: ['comments'],
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Book not found!`);
    }

    return book.comments;
  }
}
