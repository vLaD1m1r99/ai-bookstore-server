import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUserById(id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(credentials: Partial<User>): Promise<{ access_token: string }> {
    const user = await this.validateUser(
      credentials.email,
      credentials.password,
    );
    if (user) {
      const payload = { ...user };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
  async register(
    createUserDto: CreateUserDto,
    pictureFile: Express.Multer.File,
  ): Promise<{ access_token: string }> {
    const createdUser = await this.userService.create(
      createUserDto,
      pictureFile,
    );
    if (createdUser) {
      const payload = { ...createdUser };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Invalid data');
    }
  }
}
