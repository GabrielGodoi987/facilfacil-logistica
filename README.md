# facilFacil-logistica

Monorepo com duas implementações da mesma aplicação CLI de gestão de coletas:

- [`easy-easy-with-ORM/`](./easy-easy-with-ORM) — Node.js + TypeScript + **TypeORM + PostgreSQL** (com logs/auditoria)
- [`easy-easy-only-with-memory-database/`](./easy-easy-only-with-memory-database) — Node.js + TypeScript + **Yup + JSON file database** (sem logs, apenas Yup + TS)

## Estrutura

```
.
├── easy-easy-with-ORM/              # Versão com ORM
│   ├── src/
│   │   ├── application/collect/
│   │   ├── domain/{collect,audit}
│   │   ├── infra/database/          # TypeORM + Postgres
│   │   ├── presentation/controllers # inclui list-audit-logs
│   │   └── main.ts                  # menu com G. Listar logs de auditoria
│   ├── bin/main.js
│   ├── package.json                 # dotenv, pg, typeorm, yup
│   ├── tsconfig.json                # com decorators
│   ├── docker-compose.yaml
│   └── .env
│
└── easy-easy-only-with-memory-database/  # Versão JSON (sem logs)
    ├── src/
    │   ├── application/collect/
    │   ├── domain/collect/          # sem audit
    │   ├── infra/database/json-collect.repository.ts  # JSON .json
    │   ├── presentation/controllers  # sem list-audit-logs
    │   ├── data/database.json  -> ../data/database.json (na raiz do subprojeto)
    │   └── main.ts                  # menu sem G (logs)
    ├── data/database.json           # banco JSON
    ├── bin/main.js
    ├── package.json                 # apenas yup
    └── tsconfig.json                # sem decorators
```

## easy-easy-with-ORM

Stack: Node 20+, TypeScript 5, TypeORM 0.3, PostgreSQL 16, Yup

```bash
cd easy-easy-with-ORM
npm install
docker compose up -d
cat .env
npm run build
npm start
```

Menu: A. Criar coleta | B. Listar | C. Buscar por ID | D. Atualizar | E. Excluir | **F. Verificar conexão** | **G. Listar logs de auditoria** | X. Sair

## easy-easy-only-with-memory-database

Stack: **apenas** Node.js + Yup + TypeScript. Banco é um arquivo `.json` (`data/database.json`).

```bash
cd easy-easy-only-with-memory-database
npm install
npm run build
npm start
```

Menu: A. Criar coleta | B. Listar | C. Buscar por ID | D. Atualizar | E. Excluir | F. Verificar conexão com o banco (JSON) | X. Sair

> Sem opção G e sem qualquer código de auditoria/logs. O repositório `JsonCollectRepository` (`src/infra/database/json-collect.repository.ts:27`) persiste em `data/database.json` com ordenação por `createdAt DESC` e paginação.

### Exemplo do banco JSON

```json
{
  "collects": [
    {
      "id": "uuid",
      "name": "Coleta 1",
      "address": "Rua A, 123",
      "packages": 5,
      "priority": "high",
      "status": "pending",
      "createdAt": "2026-09-11T10:00:00.000Z"
    }
  ]
}
```
