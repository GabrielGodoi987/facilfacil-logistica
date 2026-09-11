# easy-easy-only-with-memory-database

Versão **sem ORM** — apenas **Node.js + Yup + TypeScript** com banco em arquivo `.json` (`data/database.json`). Sem logs/auditoria.

## Stack

- Node.js 20+
- TypeScript 5
- Yup 1.7 (validação)

Nenhum TypeORM, `pg`, `dotenv` ou `docker`.

## Estrutura

```
src/
  application/collect/       # CollectService + DTOs (Yup)
  domain/collect/
    entities/collect.ts
    enum/collect-priority.enum.ts
    enum/collect-status.enum.ts
    repositories/collect.repository.ts
  infra/database/
    json-collect.repository.ts  # lê/escreve data/database.json
  presentation/
    controllers/collect.controller.ts
    controllers/check-connection.controller.ts
    helpers/terminal.helper.ts
  main.ts                    # menu A-F, X (sem G)
data/database.json           # banco JSON
bin/main.js
```

## Uso

```bash
npm install
npm run build
npm start
# ou
node bin/main.js
```

## Menu

```
A. Criar coleta
B. Listar coletas
C. Buscar coleta por ID
D. Atualizar coleta
E. Excluir coleta
F. Verificar conexao com o banco
X. Sair
```

- **A** pede `nome`, `endereço`, `pacotes`, `prioridade` (`low|medium|high`), `status` (`pending|in_progress|completed|canceled`, default `pending`)
- **C/D/E** pedem UUID. Em **D**, Enter mantém valor.

## Banco JSON

`data/database.json`:

```json
{
  "collects": []
}
```

Implementado em `src/infra/database/json-collect.repository.ts:27`:

- `create`, `findById`, `findAll(page, limit)`, `update`, `delete`
- `findAll` ordena por `createdAt DESC` e pagina via `slice`
- `ensureFile()` cria diretório/arquivo se não existir
- Datas persistidas como ISO string e reconstituídas como `Date`

Verificação (`F`): `src/presentation/controllers/check-connection.controller.ts:6` checa existência e parse do JSON.
