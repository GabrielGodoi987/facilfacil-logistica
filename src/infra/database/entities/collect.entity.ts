import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("collect")
export class CollectEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 40, nullable: false })
  name!: string;
}
