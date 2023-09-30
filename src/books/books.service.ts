import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { RatingsService } from 'src/ratings/ratings.service';
import { CommentsService } from 'src/comments/comments.service';
@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
    private readonly ratingService: RatingsService,
    private readonly commentService: CommentsService,
  ) {}

  async findAllByUser(userId: string): Promise<Book[]> {
    return await this.bookRepo
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.users', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepo.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book not found!`);
    }
    return book;
  }

  async create(userId: string, createBookDto: CreateBookDto): Promise<Book> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User not found!`);
    }

    const book = this.bookRepo.create(createBookDto);
    user.books.push(book);
    await this.userRepo.save(user);
    return await this.bookRepo.save(book);
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
    if (updateBookDto.image) {
      bookToUpdate.image = updateBookDto.image;
    }
    if (updateBookDto.pdf) {
      bookToUpdate.pdf = updateBookDto.pdf;
    }
    if (updateBookDto.audio) {
      bookToUpdate.audio = updateBookDto.audio;
    }

    await this.bookRepo.save(bookToUpdate);

    // Find all users who have this book associated with them
    const usersToUpdateBook = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.books', 'book')
      .where('book.id = :bookId', { bookId })
      .getMany();

    // Update the book in the user's books array for each user
    for (const userToUpdate of usersToUpdateBook) {
      const bookToUpdateIndex = userToUpdate.books.findIndex(
        (book) => book.id === bookId,
      );

      if (bookToUpdateIndex === -1) {
        throw new NotFoundException(
          `Book not found or does not belong to the user!`,
        );
      } else {
        userToUpdate.books[bookToUpdateIndex] = bookToUpdate;
        await this.userRepo.save(userToUpdate);
      }
    }
    return bookToUpdate;
  }

  async remove(id: string): Promise<Book> {
    const book = await this.findOne(id);
    // Find all users who have this book associated with them
    const usersToUpdateBook = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.books', 'book')
      .where('book.id = :bookId', { id })
      .getMany();

    // Update the book in the user's books array for each user
    for (const userToUpdate of usersToUpdateBook) {
      const updatedBooks = userToUpdate.books.filter((r) => r.id !== id);
      userToUpdate.books = updatedBooks;
      await this.userRepo.save(userToUpdate);
    }
    // Delete all associated ratings for the book
    for (const rating of book.ratings) {
      await this.ratingService.remove(rating.id);
    }

    // Delete all associated comments for the book
    for (const comment of book.comments) {
      await this.commentService.remove(comment.id);
    }
    return await this.bookRepo.remove(book);
  }

  async addBookToUser(userId: string, bookId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      relations: ['books'],
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User not found!`);
    }

    const book = await this.bookRepo.findOne({ where: { id: bookId } });

    if (!book) {
      throw new NotFoundException(`Book not found!`);
    }

    user.books.push(book);

    return await this.userRepo.save(user);
  }

  async removeBookFromUser(userId: string, bookId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      relations: ['books'],
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User not found!`);
    }

    const book = user.books.find((b) => b.id === bookId);

    if (!book) {
      throw new NotFoundException(
        `Book not found or not associated with the user!`,
      );
    }

    user.books = user.books.filter((b) => b.id !== bookId);

    return this.userRepo.save(user);
  }
}
