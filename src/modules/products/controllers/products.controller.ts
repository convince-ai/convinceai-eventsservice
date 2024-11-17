import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationParamsDto } from '../../../common/dto/pagination.dto';
import { ProductsService } from '../services/products.service';
import { ProductDto } from '../dto/response/products.dto';
import { Prisma } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  async create(@Body() createProductPayload: ProductDto) {
    return await this.productService.create(createProductPayload);
  }

  @Get()
  findAll(@Query() paginationParams: PaginationParamsDto) {
    return this.productService.findAll({
      limit: paginationParams.limit,
      page: paginationParams.page,
      orderByField: paginationParams.orderByField,
      orderByDirection: paginationParams.orderByDirection,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const userFound = await this.productService.findOne(id);
    if (!userFound) throw new NotFoundException('User not found!');
    return userFound;
  }

  @Patch(':id')
  async update(@Param('id') id?: string, @Body() updateProductDto?: any) {
    return await this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.productService.remove(id);
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      )
        throw new BadRequestException(
          'The resource you are trying to delete does not exist',
        );

      throw new InternalServerErrorException();
    }
  }
}
