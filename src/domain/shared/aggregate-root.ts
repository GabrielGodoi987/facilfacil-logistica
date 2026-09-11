import { BaseEvent } from "../../shared/event-bus/events/base-event";

const domainEventsMap = new WeakMap<AggregateRoot, BaseEvent<unknown>[]>();

export abstract class AggregateRoot {
  protected addDomainEvent(event: BaseEvent<unknown>): void {
    const events = domainEventsMap.get(this) ?? [];
    events.push(event);
    domainEventsMap.set(this, events);
  }

  public pullDomainEvents(): BaseEvent<unknown>[] {
    const events = domainEventsMap.get(this) ?? [];
    domainEventsMap.set(this, []);
    return [...events];
  }

  public getDomainEvents(): BaseEvent<unknown>[] {
    return [...(domainEventsMap.get(this) ?? [])];
  }

  public clearDomainEvents(): void {
    domainEventsMap.set(this, []);
  }
}
