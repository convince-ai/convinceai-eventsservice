import { HotmartAbandonedCartPayload } from '../dto/response/hotmart-payload';

export class AbandonedCartRegisteredEvent {
  public data: HotmartAbandonedCartPayload;

  constructor(
    public readonly documentId: string,
    data: HotmartAbandonedCartPayload,
  ) {
    this.data = data;
  }
}
