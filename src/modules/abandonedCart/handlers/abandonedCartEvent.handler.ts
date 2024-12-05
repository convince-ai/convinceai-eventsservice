import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductsService } from '../../products/services/products.service';
import { AbandonedCartRegisteredEvent } from '../events/abandonedCart.event';
import { ProductDto } from '../../products/dto/response/products.dto';
import { AbandonedCartService } from '../services/abandonedCart.service';
import { RabbitMQService } from '../../messaging/services/rabbitmq.service';
import { envVars } from '../../../common/envs';
import { AbandonedCartEventRegister } from '../dto/response/hotmart-payload';

@Injectable()
export class AbandonedCartEventHandler {
  constructor(
    private readonly abandonedCartService: AbandonedCartService,
    private readonly productService: ProductsService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @OnEvent('abandonedCart.registered')
  async handleAbandonedCartRegisteredEvent(
    event: AbandonedCartRegisteredEvent,
  ) {
    const cartId = event.documentId;
    const productId = event.data.product.id;

    const product: ProductDto = await this.getProductById(productId);

    if (product) {
      await this.rabbitMQService.sendToQueue(envVars.QUEUE, {
        event: { ...event.data, product },
      });

      await this.updateEventStatus(cartId);
    }
  }

  private async getProductById(productId: number) {
    return await this.productService.findByProductId(productId);
  }

  private async updateEventStatus(eventId: string) {
    const data: Partial<AbandonedCartEventRegister> = {
      sentToQueue: true,
    };
    return await this.abandonedCartService.update(eventId, data);
  }
}
