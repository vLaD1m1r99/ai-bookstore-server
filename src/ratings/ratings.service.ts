import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepo: Repository<Rating>,
  ) {}

  async create(createRatingDto: CreateRatingDto): Promise<Rating> {
    const rating = this.ratingRepo.create(createRatingDto);
    return await this.ratingRepo.save(rating);
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
    return await this.ratingRepo.save(updateRatingDto);
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
