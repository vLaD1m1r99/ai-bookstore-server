import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Book } from 'src/books/entities/book.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepo: Repository<Rating>,
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
  ) {}

  async create(createRatingDto: CreateRatingDto): Promise<Rating> {
    const rating = this.ratingRepo.create(createRatingDto);
    const createdRating = await this.ratingRepo.save(rating);

    const book = await this.bookRepo.findOne({
      relations: ['ratings'],
      where: { id: createRatingDto.bookId },
    });

    if (!book) {
      throw new NotFoundException(`Book not found!`);
    }

    book.ratings.push(createdRating);
    await this.bookRepo.save(book);

    return createdRating;
  }

  async findOne(id: string): Promise<Rating> {
    const rating = await this.ratingRepo.findOne({ where: { id } });
    if (!rating) {
      throw new NotFoundException(`Rating not found!`);
    }
    return rating;
  }

  async update(id: string, updateRatingDto: UpdateRatingDto): Promise<Rating> {
    const rating = await this.ratingRepo.findOne({ where: { id } });
    if (!rating) {
      throw new NotFoundException(`Rating not found!`);
    }

    const updatedRating = await this.ratingRepo.save(updateRatingDto);

    const book = await this.bookRepo.findOne({
      relations: ['ratings'],
      where: { id: rating.book },
    });

    if (!book) {
      throw new NotFoundException(`Book not found!`);
    }

    const index = book.ratings.findIndex((r) => r.id === id);

    if (index !== -1) {
      book.ratings[index] = updatedRating;
      await this.bookRepo.save(book);
    }

    return updatedRating;
  }

  async remove(id: string): Promise<Rating> {
    const rating = await this.ratingRepo.findOne({ where: { id } });

    if (!rating) {
      throw new NotFoundException(`Rating not found!`);
    }

    const book = await this.bookRepo.findOne({
      relations: ['ratings'],
      where: { id: rating.book },
    });

    if (!book) {
      throw new NotFoundException(`Book not found!`);
    }

    const updatedRatings = book.ratings.filter((r) => r.id !== id);
    book.ratings = updatedRatings;

    await this.bookRepo.save(book);

    return await this.ratingRepo.remove(rating);
  }

  async findRatingByUserIdAndBookId(
    userId: string,
    bookId: string,
  ): Promise<Rating | null> {
    const rating = await this.ratingRepo.findOne({
      where: { user: userId, book: bookId },
    });

    if (!rating) {
      throw new NotFoundException(`Rating not found!`);
    }

    return rating;
  }
}
