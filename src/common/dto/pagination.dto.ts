import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  skip?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  take?: number;
}
