import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Book } from 'src/books/entities/book.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads/profileImages',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() picture: Express.Multer.File,
  ): Promise<User> {
    return await this.usersService.create(createUserDto, picture);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<User> {
    return await this.usersService.findByEmail(email);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }

  @Get(':id/books')
  async getAllBooks(@Param('id') id: string): Promise<Book[]> {
    return await this.usersService.getAllBooks(id);
  }

  @Get(':id/picture')
  async getProfilePicture(@Param('id') id: string, @Res() res): Promise<void> {
    return await this.usersService.findPicture(id, res);
  }

  @Post(':userId/books/:bookId')
  async addBookToUser(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ): Promise<User> {
    return await this.usersService.addBookToUser(userId, bookId);
  }

  @Delete(':userId/books/:bookId')
  async removeBookFromUser(
    @Param('userId') userId: string,
    @Param('bookId') bookId: string,
  ): Promise<User> {
    return await this.usersService.removeBookFromUser(userId, bookId);
  }
}
