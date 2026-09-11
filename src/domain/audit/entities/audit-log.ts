export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  // alias compatível com TG_OP do Postgres
  INSERT = "INSERT",
}

export interface AuditLog {
  id: string;
  entityName: string;
  entityId: string | null;
  action: AuditAction;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  createdAt: Date;
}
