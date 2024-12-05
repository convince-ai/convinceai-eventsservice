import { BadRequestException, Injectable } from '@nestjs/common';
import {
  AbandonedCartEventRegister,
  HotmartAbandonedCartPayload,
} from '../dto/response/hotmart-payload';
import { AbandonedCartRepository } from '../repositories/abandonedCart.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AbandonedCartRegisteredEvent } from '../../abandonedCart/events/abandonedCart.event';

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

  async remove(id: string) {
    return await this.repository.remove(id);
  }

  async update(id: string, data: Partial<AbandonedCartEventRegister>) {
    return await this.repository.update(id, data);
  }

  async findAllByProductId(productId: number) {
    return await this.repository.findAllByProductId(productId);
  }
}
