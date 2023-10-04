import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsString()
  @MaxLength(20)
  name: string;
}
