import { AuditLog } from "../entities/audit-log";

export interface AuditLogRepository {
  findByEntityId(entityName: string, entityId: string): Promise<AuditLog[]>;
  findAll(): Promise<AuditLog[]>;
}
