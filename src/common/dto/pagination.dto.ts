import { IsOptional, IsInt, IsIn, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationParamsDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  page?: number;

  @IsOptional()
  @IsString()
  orderByField?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderByDirection?: 'asc' | 'desc';
}
