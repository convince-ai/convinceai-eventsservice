import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RabbitMQService } from '../../messaging/services/rabbitmq.service';
import { ProductRegisteredEvent } from '../events/product.event';
import { AbandonedCartService } from '../../abandonedCart/services/abandonedCart.service';
import {
  AbandonedCartEventRegister,
  HotmartAbandonedCartPayload,
} from '../../abandonedCart/dto/response/hotmart-payload';

@Injectable()
export class ProductRegisteredEventHandler {
  constructor(
    private readonly abandonedCartService: AbandonedCartService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @OnEvent('product.registered')
  async handleProductRegisteredEvent(event: ProductRegisteredEvent) {
    const productId = event.data.productId;

    const abandonedCartEvents: any[] =
      await this.getAbandonedCartEvents(productId);

    if (Array.isArray(abandonedCartEvents) && !!abandonedCartEvents.length) {
      await this.rabbitMQService.sendToQueue('abandoned-cart-events', {
        event: abandonedCartEvents,
      });

      await this.updateAbandonedCartEvents(abandonedCartEvents);
    }
  }

  private async getAbandonedCartEvents(productId: number) {
    return await this.abandonedCartService.findAllByProductId(productId);
  }

  private async updateAbandonedCartEvents(
    abandonedCartEvents: HotmartAbandonedCartPayload[],
  ) {
    const data: Partial<AbandonedCartEventRegister> = {
      sentToQueue: true,
    };

    for (const events of abandonedCartEvents) {
      return await this.abandonedCartService.update(events.id, data);
    }
  }
}
