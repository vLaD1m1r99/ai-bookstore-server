import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
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
      // Passwords match
      return user;
    }
    // User not found or password is incorrect
    return null;
  }

  async login(credentials: Partial<User>): Promise<{ access_token: string }> {
    // Customize the payload as needed
    console.log(credentials);
    const user = await this.validateUser(
      credentials.email,
      credentials.password,
    );
    if (user) {
      const payload = { sub: user.id, email: user.email };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
