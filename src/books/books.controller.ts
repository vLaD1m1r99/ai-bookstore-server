import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseInterceptors,
  UseGuards,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        {
          name: 'pdf',
          maxCount: 1,
        },
      ],
      {
        storage: diskStorage({
          destination: './uploads/bookUploads',
          filename: (req, file, cb) => {
            cb(null, `${file.originalname}`);
          },
        }),
      },
    ),
  )
  create(
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; pdf?: Express.Multer.File[] },
    @Body()
    createBookDto: CreateBookDto,
  ) {
    return this.booksService.create(files, createBookDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.booksService.findOne(id);
    } catch (error) {
      throw new NotFoundException(`Book not found!`);
    }
  }

  @Get()
  findAll() {
    try {
      return this.booksService.findAll();
    } catch (error) {
      throw new NotFoundException(`Book not found!`);
    }
  }

  @Get(':id/image')
  async getBookImage(@Param('id') id: string, @Res() res): Promise<void> {
    return await this.booksService.findImage(id, res);
  }

  @Get(':id/pdf')
  async getBookPDF(@Param('id') id: string, @Res() res): Promise<void> {
    return await this.booksService.findPDF(id, res);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() userId: string,
    updateBookDto: UpdateBookDto,
  ) {
    return this.booksService.update(userId, id, updateBookDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }

  @Get('/comments/:id')
  findAllByBook(@Param('id') id: string) {
    return this.booksService.findAllComments(id);
  }
}
