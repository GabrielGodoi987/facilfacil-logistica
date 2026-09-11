import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuditLogs1710000000000 implements MigrationInterface {
  name = "CreateAuditLogs1710000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "audit_logs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "entity_name" varchar(100) NOT NULL,
        "entity_id" uuid NULL,
        "action" varchar(20) NOT NULL,
        "old_data" jsonb NULL,
        "new_data" jsonb NULL,
        "created_at" timestamp NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_audit_logs_entity" ON "audit_logs" ("entity_name", "entity_id");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_audit_logs_created_at" ON "audit_logs" ("created_at");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs";`);
  }
}
