export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  // alias compatível com TG_OP do Postgres
  INSERT = "INSERT",
}
