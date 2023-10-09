import { IsInt, Min, Max, IsUUID } from 'class-validator';
export class CreateRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  value: number;

  @IsUUID()
  user: string;

  @IsUUID()
  book: string;
}
