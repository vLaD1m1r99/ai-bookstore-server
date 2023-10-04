import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/books/entities/book.entity';
import { join } from 'path';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    pictureFile: Express.Multer.File,
  ): Promise<User> {
    console.log(pictureFile);
    const { email, password, name } = createUserDto;
    const user = this.userRepo.create({
      email,
      password,
      name,
      picture: pictureFile ? pictureFile.originalname : null,
    });
    const createdUser = await this.userRepo.save(user);
    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User not found!`);
    }
    return user;
  }

  async findPicture(id: string, res): Promise<void> {
    const user = await this.findOne(id);
    if (user.picture) {
      return res.sendFile(
        join(process.cwd(), `uploads/profileImages/${user.picture}`),
      );
    } else {
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User not found!`);
    }

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    return await this.userRepo.save(user);
  }

  async remove(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User not found!`);
    }
    return await this.userRepo.remove(user);
  }

  async getAllBooks(id: string): Promise<Book[]> {
    const user = await this.userRepo.findOne({
      relations: ['books'],
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User not found!`);
    }

    return user.books;
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

    const isBookInCollection = user.books.some(
      (userBook) => userBook.id === bookId,
    );

    if (isBookInCollection) {
      throw new ConflictException(`Book is already in the user's collection.`);
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

    const bookIndexToRemove = user.books.findIndex(
      (userBook) => userBook.id === bookId,
    );

    if (bookIndexToRemove === -1) {
      throw new NotFoundException(`Book not found in the user's collection.`);
    }

    user.books.splice(bookIndexToRemove, 1);

    return await this.userRepo.save(user);
  }
}
