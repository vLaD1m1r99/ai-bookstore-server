import { PartialType } from '@nestjs/mapped-types';
import { CreateRatingDto } from './create-rating.dto';
import { IsInt, Min, Max } from 'class-validator';
export class UpdateRatingDto extends PartialType(CreateRatingDto) {
  @IsInt()
  @Min(1)
  @Max(10)
  value: number;
}
