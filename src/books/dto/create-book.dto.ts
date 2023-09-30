import { BookGenres } from '../entities/book.entity';

export class CreateBookDto {
  title: string;
  description: string;
  pdf: string;
  genre?: BookGenres;
  author?: string;
  image?: string;
  audio?: string;
}
