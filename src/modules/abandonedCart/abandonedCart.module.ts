import { Module } from '@nestjs/common';
import { PrismaService } from '../../system/database/prisma.service';
import { AbandonedCartService } from './services/abandonedCart.service';
import { AbandonedCartController } from './controllers/abandonedCart.controller';
import { AbandonedCartRepository } from './repositories/abandonedCart.repository';
import { AbandonedCartEventHandler } from './handlers/abandonedCartEvent.handler';
import { ProductsService } from '../products/services/products.service';
import { ProductRepository } from '../products/repositories/products.repository';
import { RabbitMQModule } from '../messaging/messaging.module';

@Module({
  imports: [RabbitMQModule],
  controllers: [AbandonedCartController],
  providers: [
    PrismaService,
    AbandonedCartService,
    ProductsService,
    ProductRepository,
    AbandonedCartRepository,
    AbandonedCartEventHandler,
  ],
  exports: [AbandonedCartService],
})
export class AbandonedCartModule {}
