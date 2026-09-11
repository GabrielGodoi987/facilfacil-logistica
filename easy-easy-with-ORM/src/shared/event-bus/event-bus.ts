import { BaseEvent } from "./events/base-event";

type EventHandler = (event: BaseEvent<any>) => void;

export class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  subscribe(eventName: string, handler: EventHandler): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
  }

  publish(event: BaseEvent<any>): void {
    const eventName = event.getEventName();
    const handlers = this.handlers.get(eventName) ?? [];

    if (handlers.length === 0) {
      console.warn(`No handlers found for event: ${eventName}`);
      return;
    }

    const results = Promise.allSettled(
      handlers.map((handler) => handler(event)),
    );

    results.then((outcomes) => {
      outcomes.forEach((outcome, index) => {
        if (outcome.status === "rejected") {
          console.error(
            `Error in handler ${index + 1} for event ${eventName}:`,
            outcome.reason,
          );
        }
      });
    });
  }
}
