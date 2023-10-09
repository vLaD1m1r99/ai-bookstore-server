import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';
import { BookGenres } from '../entities/book.entity';

export class UpdateBookDto extends PartialType(CreateBookDto) {
  title?: string;
  description?: string;
  genre?: BookGenres;
  author?: string;
  image?: Express.Multer.File;
  pdf?: Express.Multer.File;
  audio?: string;
}
