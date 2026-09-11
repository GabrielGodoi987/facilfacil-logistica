import { AuditAction } from "../enum/audit-action.enum";

export class AuditLog {
  constructor(
    public id: string,
    public entityName: string,
    public entityId: string | null,
    public action: AuditAction,
    public oldData: Record<string, unknown> | null,
    public newData: Record<string, unknown> | null,
    public createdAt: Date,
  ) {}
}
