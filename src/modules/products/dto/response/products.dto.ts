import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import BaseDto from '../../../../common/dto/base.dto';

export class ProductDto extends BaseDto {
  @ApiProperty({
    description: 'Database ID',
    example: '673895f6ce05c7ce11048812',
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'E-commerce product Id',
    example: 123456789,
  })
  @IsNumber()
  productId: number;

  @ApiProperty({
    description: 'E-commerce product name',
    example: 'Python crash course',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Product Description',
    example: 'Python crash course',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 100.5,
  })
  @IsNumber()
  price: number;
}
