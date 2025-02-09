import { Injectable } from '@nestjs/common';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from '../../../common/pagination';
import { PrismaService } from '../../../system/database/prisma.service';
import {
  AbandonedCartEventRegister,
  HotmartAbandonedCartPayload,
} from '../dto/response/hotmart-payload';

@Injectable()
export class AbandonedCartRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: HotmartAbandonedCartPayload): Promise<any> {
    const abandonedCartEvent: AbandonedCartEventRegister = {
      eventId: data.id,
      buyer: data.data.buyer,
      product: data.data.product,
      creation_date: data.creation_date,
      sentToQueue: false,
    };
    return await this.prisma.abandonedCartEvent.create({
      data: abandonedCartEvent,
    });
  }

  async findAll({
    limit,
    page,
    orderByField,
    orderByDirection,
    where,
  }): Promise<PaginatedResult<AsyncGenerator>> {
    const paginate: PaginateFunction = paginator({ perPage: limit });

    const orderBy = {
      [orderByField]: orderByDirection,
    };

    return paginate(
      this.prisma.abandonedCartEvent,
      {
        where,
        orderBy,
      },
      {
        page,
      },
    );
  }

  async findOne(id: string): Promise<any> {
    return await this.prisma.abandonedCartEvent.findUnique({
      where: { id },
    });
  }

  async aggregate(pipeline: any) {
    return await this.prisma.abandonedCartEvent.aggregateRaw({ pipeline });
  }

  async update(
    id: string,
    data: Partial<AbandonedCartEventRegister>,
  ): Promise<any> {
    return await this.prisma.abandonedCartEvent.update({ where: { id }, data });
  }

  async remove(id: string): Promise<any> {
    return await this.prisma.abandonedCartEvent.delete({ where: { id } });
  }

  async findAllByProductId(productId: number) {
    return await this.prisma.abandonedCartEvent.findMany({
      where: { product: { is: { id: productId } } },
    });
  }
}
