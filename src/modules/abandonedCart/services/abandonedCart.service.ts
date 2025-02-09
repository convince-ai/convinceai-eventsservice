import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AbandonedCartEventRegister,
  HotmartAbandonedCartPayload,
} from '../dto/response/hotmart-payload';
import { AbandonedCartRepository } from '../repositories/abandonedCart.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AbandonedCartRegisteredEvent } from '../../abandonedCart/events/abandonedCart.event';
import { dddToStateMap } from '../utils';
import { AbandonedEventsByRegion, AbandonedProducts } from '../interfaces';
import { JsonObject } from '@prisma/client/runtime/library';

@Injectable()
export class AbandonedCartService {
  constructor(
    private readonly repository: AbandonedCartRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createEventDto: HotmartAbandonedCartPayload) {
    const createdEvent = await this.repository.create(createEventDto);

    if (!createdEvent)
      throw new BadRequestException('Abandoned cart event not registered');

    this.eventEmitter.emit(
      'abandonedCart.registered',
      new AbandonedCartRegisteredEvent(createdEvent.id, createdEvent),
    );

    return createdEvent;
  }

  async findAll({ limit, page, orderByField, orderByDirection }) {
    return await this.repository.findAll({
      limit,
      page,
      orderByField,
      orderByDirection,
      where: {},
    });
  }

  async findOne(id: string) {
    const userFound = await this.repository.findOne(id);

    return {
      ...userFound,
      password: undefined,
    };
  }

  async getAbandonedRegions({ limit, page, orderByField, orderByDirection }) {
    const allEvents = await this.repository.findAll({
      limit,
      page,
      orderByField,
      orderByDirection,
      where: {},
    });

    const abandonedEventsByRegion = this.mapAbandonedEvents(allEvents.data);

    return Array.from(abandonedEventsByRegion.values());
  }

  async getAbandonedProducts({ where }): Promise<AbandonedProducts[]> {
    const pipeline = [
      {
        $lookup: {
          from: 'products',
          localField: 'product.id',
          foreignField: 'productId',
          as: 'productData',
        },
      },
      {
        $unwind: {
          path: '$productData',
        },
      },
      {
        $match: {
          $and: [
            { 'productData.tenantid': where.tenantid },
            { 'productData.branchid': where.branchid },
          ],
        },
      },
      {
        $project: {
          'productData.name': 1,
          'productData.productId': 1,
        },
      },
    ];

    const allEvents = (await this.repository.aggregate(pipeline)) as any;

    const productsMap: Map<number, AbandonedProducts> = new Map();

    allEvents.forEach((el: any) => {
      const productId = el.productData.productId;
      if (productsMap.has(productId)) {
        const register = productsMap.get(productId);
        register.value++;
      } else {
        productsMap.set(productId, { name: el.productData.name, value: 1 });
      }
    });

    return Array.from(productsMap.values());
  }

  async remove(id: string) {
    return await this.repository.remove(id);
  }

  async update(id: string, data: Partial<AbandonedCartEventRegister>) {
    return await this.repository.update(id, data);
  }

  async findAllByProductId(productId: number) {
    return await this.repository.findAllByProductId(productId);
  }

  protected mapAbandonedEvents(
    abandonedEvents: any,
  ): Map<string, AbandonedEventsByRegion> {
    const regex = /^\d{2}(\d{2})/;
    const eventsByRegion: Map<string, AbandonedEventsByRegion> = new Map();

    for (const event of abandonedEvents) {
      const phoneNumber = event.buyer.phone;
      const match = phoneNumber.match(regex);
      const ddd = match ? match[1] : null;

      if (!ddd) continue;

      const state = dddToStateMap[ddd];
      if (!eventsByRegion.has(phoneNumber)) {
        eventsByRegion.set(state, { abandonedCarts: 1, state, ddd });
      } else {
        const register = eventsByRegion.get(state);
        register.abandonedCarts++;
      }
    }

    return eventsByRegion;
  }
}
