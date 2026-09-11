# Easy Easy Logistic — facilFacil-logística

Aplicação interativa de terminal em **Node.js + TypeScript + TypeORM + PostgreSQL + BullMQ** para gestão de coletas.

## Resumo Operacional

| Item | Detalhe |
|------|---------|
| **Stack** | Node 20+, TypeScript 5, TypeORM 0.3, PostgreSQL 16, Redis 7, BullMQ 6, Yup |
| **Entrada** | `src/main.ts` → `bin/main.js` (menu CLI) |
| **Banco** | `AppDataSource` (`src/infra/database/data-source.ts`) com `migrationsRun: true` |
| **Entidades** | `collect` e `audit_logs` (`src/infra/database/entities/`) |
| **Auditoria** | Tabela `audit_logs` criada via migration — sem triggers/functions |
| **Fila** | `collectQueue` em `src/shared/queue/bullmq.ts` (Redis) |
| **Build** | `npm run build` → `dist/` |
| **Execução** | `docker compose up -d` → `npm run build` → `npm start` |

---

## Requisitos

- Node.js 20 ou superior
- npm
- Docker com Docker Compose

## Inicialização Rápida

```bash
# 1. Dependências
npm install

# 2. Infra (Postgres + Redis)
docker compose up -d

# 3. Variáveis de ambiente (.env já com defaults)
cat .env
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=easy-easy-logistic
# DB_USER=sa
# DB_PASSWORD=123
# REDIS_HOST=localhost
# REDIS_PORT=6379

# 4. Build
npm run build

# 5. Menu interativo
npm start
# ou
node bin/main.js
```

O `AppDataSource.initialize()` executa automaticamente as migrations pendentes (`migrationsRun: true`), criando `audit_logs` se ainda não existir. Não é necessário rodar `typeorm migration:run` manualmente.

## Opções do Menu

```
A. Criar coleta
B. Listar coletas com paginação
C. Buscar coleta por ID
D. Atualizar coleta
E. Excluir coleta
F. Verificar conexão com o banco
X. Sair
```

- **A** solicita `nome`, `endereço`, `pacotes`, `prioridade` (`low`|`medium`|`high`) e `status` (`pending`|`in_progress`|`completed`|`canceled`, default `pending`).
- **C/D/E** pedem UUID da coleta. Em **D**, pressione Enter para manter o valor atual.

O executável de entrada continua sendo `bin/main.js`, registrado em `bin` do `package.json`.

## Auditoria — `audit_logs`

Tabela criada para registrar operações em `collect`. Escopo atual: **apenas criação da tabela**, sem triggers ou functions no banco.

**Migration:** `src/infra/database/migrations/1710000000000-CreateAuditLogs.ts`

```sql
CREATE TABLE "audit_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "entity_name" varchar(100) NOT NULL,  -- ex: 'collect'
  "entity_id" uuid NULL,                -- FK lógico para collect.id
  "action" varchar(20) NOT NULL,        -- CREATE | UPDATE | DELETE
  "old_data" jsonb NULL,
  "new_data" jsonb NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);
CREATE INDEX "IDX_audit_logs_entity" ON "audit_logs" ("entity_name", "entity_id");
CREATE INDEX "IDX_audit_logs_created_at" ON "audit_logs" ("created_at");
```

Entidades:

- Domínio: `src/domain/audit/entities/audit-log.ts` — `enum AuditAction { CREATE, UPDATE, DELETE, INSERT }` e `interface AuditLog`.
- Infra: `src/infra/database/entities/audit-log.entity.ts` — `@Entity("audit_logs")` mapeada 1:1 com a tabela.

Registrada em `src/infra/database/data-source.ts:13`:

```ts
entities: [CollectEntity, AuditLogEntity],
migrations: [__dirname + "/migrations/*.{ts,js}"],
migrationsRun: true,
```

### Como consultar

Via TypeORM:

```ts
const logs = await AppDataSource.getRepository(AuditLogEntity).find({
  where: { entityName: 'collect' },
  order: { createdAt: 'DESC' },
});
```

Via SQL:

```sql
-- Todas as entradas
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 20;

-- Por coleta
SELECT action, old_data, new_data, created_at
FROM audit_logs
WHERE entity_name = 'collect' AND entity_id = 'SEU_UUID'
ORDER BY created_at;
```

Verificação:

```bash
docker exec -it easy-easy-logistic-postgres psql -U sa -d easy-easy-logistic -c "\d audit_logs"
docker exec -it easy-easy-logistic-postgres psql -U sa -d easy-easy-logistic -c "SELECT * FROM audit_logs LIMIT 5;"
```

## Coleta — Domínio e Aplicação

```
src/domain/collect/entities/collect.ts          # Collect, CollectPriority, CollectStatus
src/domain/collect/repositories/collect.repository.ts  # Contrato CollectRepository
src/infra/database/entities/collect.entity.ts   # @Entity("collect")
src/infra/database/repositories/typeorm-collect.repository.ts  # TypeOrmCollectRepository
src/application/collect/collect.service.ts      # CollectService (injeção de CollectRepository)
src/application/collect/dto/collect.dto.ts      # DTOs + schemas Yup
```

`CollectService` centraliza validações Yup e delega ao repositório:

- `create(data: CreateCollectDto)` → `collectRepository.create`
- `findById({id})` → `findOneBy`
- `findAll(page, limit)` → `findAndCount` com `order: {createdAt: "DESC"}`
- `update({id}, data)` → `findOneBy` + `Object.assign` + `save`
- `delete({id})` → `delete`

## BullMQ

`src/shared/queue/bullmq.ts` exporta:

```ts
export const redisConnection = { host, port, maxRetriesPerRequest: null };
export const collectQueue = new Queue("collect", { connection: redisConnection });
```

Pronto para `collectQueue.add(...)` e workers dedicados.

## Estrutura do Projeto

```
src/
  application/collect/       # Services e DTOs
  domain/
    collect/                 # Entidades e contratos de domínio
    audit/                   # Entidade de auditoria (AuditLog, AuditAction)
  infra/database/
    entities/                # CollectEntity, AuditLogEntity
    repositories/            # TypeOrmCollectRepository
    migrations/              # 1710000000000-CreateAuditLogs.ts
    data-source.ts           # AppDataSource
  shared/queue/              # BullMQ
  main.ts                    # CLI interativo
bin/main.js                  # Entrypoint (package.json: bin.main)
dist/                        # Saída de npm run build
docker-compose.yaml          # postgres:16-alpine + redis:7-alpine
```

## Configuração e Build

```bash
npm run build   # tsc → dist/
npm start       # node bin/main.js
```

`AppDataSource` (`src/infra/database/data-source.ts:6`):

```ts
new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [CollectEntity, AuditLogEntity],
  migrations: [__dirname + "/migrations/*.{ts,js}"],
  synchronize: false,
  migrationsRun: true,
  logging: false,
});
```

## Parar a Infra

```bash
docker compose down        # para containers
docker compose down -v     # remove volumes (apaga dados de postgres_data/redis_data)
```
