import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsUUID()
  user: User;

  @IsUUID()
  bookId: string;
}
