import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './system/database/prisma.service';
import { AbandonedCartModule } from './modules/abandonedCart/abandonedCart.module';
import { ProductsModule } from './modules/products/products.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RabbitMQService } from './modules/messaging/services/rabbitmq.service';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    AbandonedCartModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, RabbitMQService],
})
export class AppModule {}
