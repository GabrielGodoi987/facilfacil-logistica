import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import {
  CollectPriority,
  CollectStatus,
} from "../../../domain/collect/entities/collect";

@Entity("collect")
export class CollectEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  name!: string;

  @Column({ type: "text", nullable: false })
  address!: string;

  @Column({ type: "text", nullable: false })
  packages!: string;

  @Column({ type: "varchar", length: 20, nullable: false })
  priority!: CollectPriority;

  @Column({ type: "varchar", length: 20, nullable: false })
  status!: CollectStatus;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
}
