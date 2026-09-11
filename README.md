# Easy Easy Logistic

Aplicacao interativa de terminal em Node.js com TypeScript, TypeORM, dotenv e PostgreSQL.

## Requisitos

- Node.js 20 ou superior
- npm
- Docker com Docker Compose

## Inicializar a aplicacao

1. Instale as dependencias:

   ```bash
   npm install
   ```

2. Suba o PostgreSQL:

   ```bash
   docker compose up -d
   ```

3. Confira o arquivo `.env`. Os valores padrao sao:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=easy-easy-logistic
   DB_USER=sa
   DB_PASSWORD=123
   ```

4. Compile o TypeScript:

   ```bash
   npm run build
   ```

5. Inicie o menu:

   ```bash
   npm run start
   ```

O menu sera aberto no terminal. Escolha uma opcao digitando o numero correspondente.

## Opcoes do menu

```bash
1. Verificar conexao com o banco
0. Sair
```

O executavel de entrada continua sendo `bin/main.js`, registrado no campo `bin` do `package.json`.

## Parar o banco

```bash
docker compose down
```

Para remover tambem os dados persistidos:

```bash
docker compose down -v
```