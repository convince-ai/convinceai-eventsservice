import { Injectable } from '@nestjs/common';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from '../../../common/pagination';
import { PrismaService } from '../../../system/database/prisma.service';
import { ProductDto } from '../dto/response/products.dto';
import { UpdateProductDto } from '../dto/response/updateProduct.dto';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: ProductDto): Promise<any> {
    return await this.prisma.product.create({ data });
  }

  async findAll({
    limit,
    page,
    orderByField,
    orderByDirection,
  }): Promise<PaginatedResult<AsyncGenerator>> {
    const paginate: PaginateFunction = paginator({ perPage: limit });

    const orderBy = {
      [orderByField]: orderByDirection,
    };

    return paginate(
      this.prisma.product,
      {
        orderBy,
      },
      {
        page,
      },
    );
  }

  async findOne(id: string): Promise<any> {
    return await this.prisma.product.findUnique({
      where: { id },
    });
  }

  async findByProductId(productId: number) {
    return await this.prisma.product.findFirst({ where: { productId } });
  }

  async update(id: string, data: UpdateProductDto) {
    return await this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.product.delete({ where: { id } });
  }
}
