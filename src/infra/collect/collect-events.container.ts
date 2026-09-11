import { CollectCreatedEvent } from "../../domain/collect/events/collect-created.event";
import { CollectDeletedEvent } from "../../domain/collect/events/collect-deleted.event";
import { CollectStatusEvent } from "../../domain/collect/events/collect-status.event";
import { CollectUpdatedEvent } from "../../domain/collect/events/collect-updated.event";
import { EventBus } from "../../shared/event-bus/event-bus";
import { BaseEvent } from "../../shared/event-bus/events/base-event";

export class CollectEventsContainer {
  constructor(private readonly eventBus: EventBus) {
    this.register();
  }

  private register(): void {
    this.eventBus.subscribe("collect.created", (event: BaseEvent<unknown>) =>
      this.handleCreated(event as CollectCreatedEvent),
    );

    this.eventBus.subscribe("collect.updated", (event: BaseEvent<unknown>) =>
      this.handleUpdated(event as CollectUpdatedEvent),
    );

    this.eventBus.subscribe("collect.deleted", (event: BaseEvent<unknown>) =>
      this.handleDeleted(event as CollectDeletedEvent),
    );

    this.eventBus.subscribe("collect.status", (event: BaseEvent<unknown>) =>
      this.handleStatus(event as CollectStatusEvent),
    );
  }

  private handleCreated(event: CollectCreatedEvent): void {
    const collect = event.getData();
    console.log(`[CollectEvents] collect.created -> id=${collect?.id}`);
  }

  private handleUpdated(event: CollectUpdatedEvent): void {
    const data = event.getData();
    console.log(`[CollectEvents] collect.updated -> id=${data?.id}`);
  }

  private handleDeleted(event: CollectDeletedEvent): void {
    const data = event.getData();
    console.log(`[CollectEvents] collect.deleted -> id=${data?.id}`);
  }

  private handleStatus(event: CollectStatusEvent): void {
    const data = event.getData();
    console.log(
      `[CollectEvents] collect.status -> id=${data?.id} ${data?.previousStatus} -> ${data?.currentStatus}`,
    );
  }
}
