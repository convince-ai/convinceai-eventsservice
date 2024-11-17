import { ProductDto } from '../dto/response/products.dto';

export class ProductRegisteredEvent {
  public data: ProductDto;

  constructor(data: ProductDto) {
    this.data = data;
  }
}
