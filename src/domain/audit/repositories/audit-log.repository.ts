import { AuditLog } from "../entities/audit-log";

export interface IAuditLogRepository {
  findByEntityId(entityName: string, entityId: string): Promise<AuditLog[]>;
  findAll(): Promise<AuditLog[]>;
  registry(auditLog: AuditLog): Promise<void>;
}
