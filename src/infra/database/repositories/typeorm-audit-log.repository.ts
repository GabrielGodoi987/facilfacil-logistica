import { Repository } from "typeorm";
import { AuditLog } from "../../../domain/audit/entities/audit-log";
import { IAuditLogRepository } from "../../../domain/audit/repositories/audit-log.repository";
import { AuditLogEntity } from "../entities/audit-log.entity";

export class TypeOrmAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly repository: Repository<AuditLogEntity>) {}

  async findByEntityId(
    entityName: string,
    entityId: string,
  ): Promise<AuditLog[]> {
    const entities = await this.repository.find({
      where: { entityName, entityId },
      order: { createdAt: "DESC" },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async findAll(): Promise<AuditLog[]> {
    const entities = await this.repository.find({
      order: { createdAt: "DESC" },
    });

    return entities.map((entity) => this.toDomain(entity));
  }

  async registry(auditLog: AuditLog): Promise<void> {
    const entity = this.repository.create({
      id: auditLog.id,
      entityName: auditLog.entityName,
      entityId: auditLog.entityId,
      action: auditLog.action,
      oldData: auditLog.oldData,
      newData: auditLog.newData,
      createdAt: auditLog.createdAt,
    });

    await this.repository.save(entity);
  }

  private toDomain(entity: AuditLogEntity): AuditLog {
    return new AuditLog(
      entity.id,
      entity.entityName,
      entity.entityId,
      entity.action,
      entity.oldData,
      entity.newData,
      entity.createdAt,
    );
  }
}
