import { Module } from '@nestjs/common';
import { PrismaService } from '../../system/database/prisma.service';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { ProductRepository } from './repositories/products.repository';
import { AbandonedCartRepository } from '../abandonedCart/repositories/abandonedCart.repository';
import { AbandonedCartService } from '../abandonedCart/services/abandonedCart.service';
import { ProductRegisteredEventHandler } from './handlers/productRegistered.handler';
import { RabbitMQModule } from '../messaging/messaging.module';

@Module({
  imports: [RabbitMQModule],
  controllers: [ProductsController],
  providers: [
    PrismaService,
    AbandonedCartService,
    AbandonedCartRepository,
    ProductRepository,
    ProductsService,
    ProductRegisteredEventHandler,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
