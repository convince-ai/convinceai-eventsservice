import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AbandonedCartEventRegister,
  HotmartAbandonedCartPayload,
} from '../dto/response/hotmart-payload';
import { AbandonedCartRepository } from '../repositories/abandonedCart.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AbandonedCartRegisteredEvent } from '../../abandonedCart/events/abandonedCart.event';
import { dddToStateMap } from '../utils';
import { AbandonedEventsByRegion } from '../interfaces';

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
    });

    const abandonedEventsByRegion = this.mapAbandonedEvents(allEvents.data);

    return Array.from(abandonedEventsByRegion.values());
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

  mapAbandonedEvents(
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
