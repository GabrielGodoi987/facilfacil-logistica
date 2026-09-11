import { randomUUID } from "crypto";
import { BaseEvent } from "../../../shared/event-bus/events/base-event";

export type CollectDeletedPayload = {
  id: string;
};

export class CollectDeletedEvent extends BaseEvent<CollectDeletedPayload> {
  constructor(data: CollectDeletedPayload, correlationId: string = randomUUID()) {
    super(randomUUID(), "collect.deleted", correlationId, new Date(), data);
  }
}
