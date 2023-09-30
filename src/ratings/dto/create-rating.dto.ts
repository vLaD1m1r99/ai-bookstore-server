import { IsInt, Min, Max, IsUUID } from 'class-validator';
export class CreateRatingDto {
  @IsInt()
  @Min(1)
  @Max(10)
  value: number;

  @IsUUID()
  userId: string;

  @IsUUID()
  bookId: string;
}
