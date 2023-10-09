import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        '00c47539d9d503c020b88625ca0bd8272402cff50be0246e2c28f53da4d03666',
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.authService.validateUserById(payload.id);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }
}
