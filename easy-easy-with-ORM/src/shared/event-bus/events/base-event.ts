export abstract class BaseEvent<T> {
  constructor(
    private id: string,
    private eventName: string,
    private correlationId: string,
    private occurredAt: Date = new Date(),
    private data?: T,
  ) {}

  getId(): string {
    return this.id;
  }

  getEventName(): string {
    return this.eventName;
  }

  getCorrelationId(): string {
    return this.correlationId;
  }

  getData(): T | undefined {
    return this.data;
  }

  getOccurredAt(): Date {
    return this.occurredAt;
  }
}
