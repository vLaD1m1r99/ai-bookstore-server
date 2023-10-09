import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() credentials): Promise<{ access_token: string }> {
    return this.authService.login(credentials as Partial<User>);
  }

  @Post('register')
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
  async register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() picture: Express.Multer.File,
  ): Promise<{ access_token: string }> {
    return await this.authService.register(createUserDto, picture);
  }
}
