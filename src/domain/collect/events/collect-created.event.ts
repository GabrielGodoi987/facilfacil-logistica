import { randomUUID } from "crypto";
import { BaseEvent } from "../../../shared/event-bus/events/base-event";
import { Collect } from "../entities/collect";

export class CollectCreatedEvent extends BaseEvent<Collect> {
  constructor(data: Collect, correlationId: string = randomUUID()) {
    super(randomUUID(), "collect.created", correlationId, new Date(), data);
  }
}
