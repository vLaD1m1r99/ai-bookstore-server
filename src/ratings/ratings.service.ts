import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';
@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepo: Repository<Rating>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
  ) {}

  async create(createRatingDto: CreateRatingDto): Promise<Rating | null> {
    const user = await this.userRepo.findOne({
      where: { id: createRatingDto.user },
    });
    const book = await this.bookRepo.findOne({
      where: { id: createRatingDto.book },
    });
    if (user && book) {
      const rating = this.ratingRepo.create({
        ...createRatingDto,
        user: user,
        book: book,
      });
      return await this.ratingRepo.save(rating);
    } else return null;
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
    const ratingToUpdate = { ...rating, value: updateRatingDto.value };
    return await this.ratingRepo.save(ratingToUpdate);
  }

  async remove(id: string): Promise<Rating> {
    const rating = await this.ratingRepo.findOne({ where: { id } });

    if (!rating) {
      throw new NotFoundException(`Rating not found!`);
    }
    return await this.ratingRepo.remove(rating);
  }

  async findRatingByUserIdAndBookId(
    userId: string,
    bookId: string,
  ): Promise<Rating> {
    const rating = await this.ratingRepo.findOne({
      where: { user: { id: userId }, book: { id: bookId } },
    });
    if (!rating) {
      throw new NotFoundException(`Rating not found!`);
    }
    return rating;
  }
}
