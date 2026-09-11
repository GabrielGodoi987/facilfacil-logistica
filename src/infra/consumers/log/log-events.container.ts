import { randomUUID } from "crypto";
import { AuditLog } from "../../../domain/audit/entities/audit-log";
import { AuditAction } from "../../../domain/audit/enum/audit-action.enum";
import { IAuditLogRepository } from "../../../domain/audit/repositories/audit-log.repository";
import { CollectCreatedEvent } from "../../../domain/collect/events/collect-created.event";
import { CollectDeletedEvent } from "../../../domain/collect/events/collect-deleted.event";
import { CollectStatusEvent } from "../../../domain/collect/events/collect-status.event";
import { CollectUpdatedEvent } from "../../../domain/collect/events/collect-updated.event";
import { EventBus } from "../../../shared/event-bus/event-bus";
import { BaseEvent } from "../../../shared/event-bus/events/base-event";

export class LogEventsContainer {
  constructor(
    private readonly auditLogRepository: IAuditLogRepository,
    private readonly eventBus: EventBus,
  ) {
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

  private async handleCreated(event: CollectCreatedEvent): Promise<void> {
    const collect = event.getData();
    if (!collect) return;

    const auditLog = new AuditLog(
      randomUUID(),
      "collect",
      collect.id,
      AuditAction.CREATE,
      null,
      collect as unknown as Record<string, unknown>,
      event.getOccurredAt() ?? new Date(),
    );

    await this.auditLogRepository.registry(auditLog);
    console.log(`[Event] collect.created -> Audit log criado para collect ${collect.id}`);
  }

  private async handleUpdated(event: CollectUpdatedEvent): Promise<void> {
    const data = event.getData();
    if (!data) return;

    const auditLog = new AuditLog(
      randomUUID(),
      "collect",
      data.id,
      AuditAction.UPDATE,
      data.previous as unknown as Record<string, unknown> | null,
      data.current as unknown as Record<string, unknown>,
      event.getOccurredAt() ?? new Date(),
    );

    await this.auditLogRepository.registry(auditLog);
    console.log(`[Event] collect.updated -> Audit log criado para collect ${data.id}`);
  }

  private async handleDeleted(event: CollectDeletedEvent): Promise<void> {
    const data = event.getData();
    if (!data) return;

    const auditLog = new AuditLog(
      randomUUID(),
      "collect",
      data.id,
      AuditAction.DELETE,
      { id: data.id } as unknown as Record<string, unknown>,
      null,
      event.getOccurredAt() ?? new Date(),
    );

    await this.auditLogRepository.registry(auditLog);
    console.log(`[Event] collect.deleted -> Audit log criado para collect ${data.id}`);
  }

  private async handleStatus(event: CollectStatusEvent): Promise<void> {
    const data = event.getData();
    if (!data) return;

    const auditLog = new AuditLog(
      randomUUID(),
      "collect",
      data.id,
      AuditAction.UPDATE,
      { previousStatus: data.previousStatus } as unknown as Record<string, unknown>,
      { currentStatus: data.currentStatus } as unknown as Record<string, unknown>,
      event.getOccurredAt() ?? new Date(),
    );

    await this.auditLogRepository.registry(auditLog);
    console.log(
      `[Event] collect.status -> Audit log criado para collect ${data.id} (${data.previousStatus} -> ${data.currentStatus})`,
    );
  }
}
