import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterCollectPackagesToInt1710000000001 implements MigrationInterface {
  name = "AlterCollectPackagesToInt1710000000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Garante que a tabela collect exista (caso banco novo sem migration anterior de collect)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "collect" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(100) NOT NULL,
        "address" text NOT NULL,
        "packages" text NOT NULL,
        "priority" varchar(20) NOT NULL,
        "status" varchar(20) NOT NULL,
        "createdAt" timestamp NOT NULL DEFAULT now()
      );
    `);

    // Converte packages de text -> integer, protegendo valores não numéricos
    // Se packages contiver texto não numérico, converte para 1 (valor mínimo válido)
    await queryRunner.query(`
      ALTER TABLE "collect"
      ALTER COLUMN "packages" TYPE integer
      USING (
        CASE
          WHEN "packages" ~ '^[0-9]+$' THEN "packages"::integer
          ELSE 1
        END
      );
    `);

    // Garante constraint de packages > 0 no banco
    await queryRunner.query(`
      ALTER TABLE "collect"
      ADD CONSTRAINT "CHK_collect_packages_positive" CHECK ("packages" > 0);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "collect" DROP CONSTRAINT IF EXISTS "CHK_collect_packages_positive";
    `);

    await queryRunner.query(`
      ALTER TABLE "collect"
      ALTER COLUMN "packages" TYPE text
      USING "packages"::text;
    `);
  }
}
