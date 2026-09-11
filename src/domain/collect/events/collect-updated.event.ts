import { randomUUID } from "crypto";
import { BaseEvent } from "../../../shared/event-bus/events/base-event";
import { Collect } from "../entities/collect";

export type CollectUpdatedPayload = {
  id: string;
  previous: Collect | null;
  current: Collect;
};

export class CollectUpdatedEvent extends BaseEvent<CollectUpdatedPayload> {
  constructor(data: CollectUpdatedPayload, correlationId: string = randomUUID()) {
    super(randomUUID(), "collect.updated", correlationId, new Date(), data);
  }
}
