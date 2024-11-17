import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/products.repository';
import { ProductDto } from '../dto/response/products.dto';
import { UpdateProductDto } from '../dto/response/updateProduct.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProductRegisteredEvent } from '../events/product.event';

@Injectable()
export class ProductsService {
  constructor(
    private readonly repository: ProductRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createProductDto: ProductDto) {
    const foundProduct = await this.findByProductId(createProductDto.productId);
    if (foundProduct)
      throw new BadRequestException('Product already registered!');

    const createdProduct = await this.repository.create(createProductDto);

    if (!createdProduct)
      throw new BadRequestException('Failed to register product!');

    this.eventEmitter.emit(
      'product.registered',
      new ProductRegisteredEvent(createdProduct),
    );

    return createdProduct;
  }

  async findAll({ limit, page, orderByField, orderByDirection }) {
    return await this.repository.findAll({
      limit,
      page,
      orderByField,
      orderByDirection,
    });
  }

  async findOne(id: string) {
    return await this.repository.findOne(id);
  }

  async findByProductId(productId: number) {
    return await this.repository.findByProductId(productId);
  }

  async isRegistered(id: number) {
    const foundProduct = await this.repository.findByProductId(id);
    if (!foundProduct) return;
    return foundProduct;
  }

  async update(id: string, updateUserDto: UpdateProductDto) {
    return await this.repository.update(id, updateUserDto);
  }

  async remove(id: string) {
    return await this.repository.remove(id);
  }
}
