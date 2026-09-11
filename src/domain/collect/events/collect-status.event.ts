import { randomUUID } from "crypto";
import { BaseEvent } from "../../../shared/event-bus/events/base-event";
import { CollectStatus } from "../enum/collect-status.enum";

export type CollectStatusPayload = {
  id: string;
  previousStatus: CollectStatus | null;
  currentStatus: CollectStatus;
};

export class CollectStatusEvent extends BaseEvent<CollectStatusPayload> {
  constructor(data: CollectStatusPayload, correlationId: string = randomUUID()) {
    super(randomUUID(), "collect.status", correlationId, new Date(), data);
  }
}
