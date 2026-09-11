import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AuditAction } from "../../../domain/audit/enum/audit-action.enum";

@Entity("audit_logs")
export class AuditLogEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "entity_name", type: "varchar", length: 100 })
  entityName!: string;

  @Column({ name: "entity_id", type: "uuid", nullable: true })
  entityId!: string | null;

  @Column({ type: "varchar", length: 20 })
  action!: AuditAction;

  @Column({ name: "old_data", type: "jsonb", nullable: true })
  oldData!: Record<string, unknown> | null;

  @Column({ name: "new_data", type: "jsonb", nullable: true })
  newData!: Record<string, unknown> | null;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;
}
