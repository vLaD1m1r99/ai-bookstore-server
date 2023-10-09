import { IsString } from 'class-validator';
import { BookGenres } from '../entities/book.entity';

export class CreateBookDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  genre?: BookGenres;
  @IsString()
  author?: string;
  @IsString()
  userId: string;
}
