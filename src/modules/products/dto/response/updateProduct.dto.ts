import { PartialType } from '@nestjs/swagger';
import { ProductDto } from './products.dto';

export class UpdateProductDto extends PartialType(ProductDto) {}
