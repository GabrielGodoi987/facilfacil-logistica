import { stdin as input, stdout as output } from "process";
import { createInterface } from "readline/promises";
import * as yup from "yup";
import { CollectService } from "./application/collect/collect.service";
import {
  CreateCollectDto,
  PaginationDto,
  UpdateCollectDto,
} from "./application/collect/dto/collect.dto";
import {
  CollectPriority,
  CollectStatus,
} from "./domain/collect/entities/collect";
import { AppDataSource } from "./infra/database/data-source";
import { CollectEntity } from "./infra/database/entities/collect.entity";
import { TypeOrmCollectRepository } from "./infra/database/repositories/typeorm-collect.repository";

const green = "\x1b[32m";
const reset = "\x1b[0m";
const logo = `
  ███████╗ █████╗  ██████╗██╗██╗         ███████╗ █████╗  ██████╗██╗██╗
  ██╔════╝██╔══██╗██╔════╝██║██║         ██╔════╝██╔══██╗██╔════╝██║██║
  █████╗  ███████║██║     ██║██║         █████╗  ███████║██║     ██║██║
  ██╔══╝  ██╔══██║██║     ██║██║         ██╔══╝  ██╔══██║██║     ██║██║
  ██║     ██║  ██║╚██████╗██║███████╗    ██║     ██║  ██║╚██████╗██║███████╗
  ╚═╝     ╚═╝  ╚═╝ ╚═════╝╚═╝╚══════╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝╚═╝╚══════╝`;

const showMenu = (): void => {
  console.clear();
  console.log(`${green}${logo}${reset}`);
  console.log("\nfacilfacil-logistica\n");
  console.log("A. Criar coleta");
  console.log("B. Listar coletas");
  console.log("C. Buscar coleta por ID");
  console.log("D. Atualizar coleta");
  console.log("E. Excluir coleta");
  console.log("F. Verificar conexao com o banco");
  console.log("X. Sair");
};

const menuOptionSchema = yup
  .string()
  .trim()
  .uppercase()
  .oneOf(["A", "B", "C", "D", "E", "F", "X"], "Escolha uma opcao valida.")
  .required("Escolha uma opcao.");

const prioritySchema = yup
  .mixed<CollectPriority>()
  .oneOf(Object.values(CollectPriority), "Prioridade invalida.")
  .required("Prioridade e obrigatoria.");

const statusSchema = yup
  .mixed<CollectStatus>()
  .oneOf(Object.values(CollectStatus), "Status invalido.")
  .required("Status e obrigatorio.");

const ask = async (
  terminal: ReturnType<typeof createInterface>,
  label: string,
): Promise<string> => (await terminal.question(label)).trim();

const pause = async (
  terminal: ReturnType<typeof createInterface>,
): Promise<void> => {
  await terminal.question("\nPressione Enter para voltar ao menu.");
};

const showError = (error: unknown): void => {
  if (error instanceof yup.ValidationError) {
    console.error(`\n${error.errors.join("\n")}`);
    return;
  }

  console.error("\nNao foi possivel executar a operacao:", error);
};

const askPriority = async (
  terminal: ReturnType<typeof createInterface>,
): Promise<CollectPriority> => {
  console.log("\nPrioridades: low, medium, high");
  const value = await ask(terminal, "Prioridade: ");

  return prioritySchema.validate(value);
};

const askStatus = async (
  terminal: ReturnType<typeof createInterface>,
  defaultValue?: CollectStatus,
): Promise<CollectStatus> => {
  console.log("\nStatus: pending, in_progress, completed, canceled");
  const value = await ask(
    terminal,
    `Status${defaultValue ? ` [${defaultValue}]` : ""}: `,
  );

  return statusSchema.validate(value || defaultValue);
};

const createCollect = async (
  terminal: ReturnType<typeof createInterface>,
  service: CollectService,
): Promise<void> => {
  const data: CreateCollectDto = {
    name: await ask(terminal, "Nome: "),
    address: await ask(terminal, "Endereco: "),
    packages: await ask(terminal, "Pacotes: "),
    priority: await askPriority(terminal),
    status: await askStatus(terminal, CollectStatus.PENDING),
  };
  const collect = await service.create(data);

  console.log("\nColeta criada com sucesso:");
  console.log(JSON.stringify(collect, null, 2));
};

const listCollects = async (
  terminal: ReturnType<typeof createInterface>,
  service: CollectService,
): Promise<void> => {
  const pagination: PaginationDto = {
    page: Number(await ask(terminal, "Pagina [1]: ")) || 1,
    limit: Number(await ask(terminal, "Itens por pagina [10]: ")) || 10,
  };
  const result = await service.findAll(pagination);

  console.log(
    `\nTotal: ${result.total} | Pagina ${result.page}/${result.totalPages || 1}`,
  );
  console.log(JSON.stringify(result.items, null, 2));
};

const askId = async (
  terminal: ReturnType<typeof createInterface>,
): Promise<string> => ask(terminal, "ID da coleta: ");

const findCollect = async (
  terminal: ReturnType<typeof createInterface>,
  service: CollectService,
): Promise<void> => {
  const collect = await service.findById({ id: await askId(terminal) });

  console.log(
    collect ? JSON.stringify(collect, null, 2) : "\nColeta nao encontrada.",
  );
};

const updateCollect = async (
  terminal: ReturnType<typeof createInterface>,
  service: CollectService,
): Promise<void> => {
  const id = await askId(terminal);
  const data: UpdateCollectDto = {};
  const name = await ask(terminal, "Nome (Enter para manter): ");
  const address = await ask(terminal, "Endereco (Enter para manter): ");
  const packages = await ask(terminal, "Pacotes (Enter para manter): ");
  const priority = await ask(terminal, "Prioridade (Enter para manter): ");
  const status = await ask(terminal, "Status (Enter para manter): ");

  if (name) data.name = name;
  if (address) data.address = address;
  if (packages) data.packages = packages;
  if (priority) data.priority = await prioritySchema.validate(priority);
  if (status) data.status = await statusSchema.validate(status);

  const collect = await service.update({ id }, data);

  console.log(
    collect ? JSON.stringify(collect, null, 2) : "\nColeta nao encontrada.",
  );
};

const deleteCollect = async (
  terminal: ReturnType<typeof createInterface>,
  service: CollectService,
): Promise<void> => {
  const result = await service.delete({ id: await askId(terminal) });

  console.log(
    result.deleted ? "\nColeta excluida." : "\nColeta nao encontrada.",
  );
};

const start = async (): Promise<void> => {
  const terminal = createInterface({ input, output });

  try {
    await AppDataSource.initialize();
    const repository = new TypeOrmCollectRepository(
      AppDataSource.getRepository(CollectEntity),
    );
    const service = new CollectService(repository);
    let running = true;

    while (running) {
      showMenu();
      const option = await terminal.question("\nEscolha uma opcao: ");

      try {
        const validOption = await menuOptionSchema.validate(option);

        switch (validOption) {
          case "A":
            await createCollect(terminal, service);
            await pause(terminal);
            break;
          case "B":
            await listCollects(terminal, service);
            await pause(terminal);
            break;
          case "C":
            await findCollect(terminal, service);
            await pause(terminal);
            break;
          case "D":
            await updateCollect(terminal, service);
            await pause(terminal);
            break;
          case "E":
            await deleteCollect(terminal, service);
            await pause(terminal);
            break;
          case "F":
            console.log("\nConexao com o PostgreSQL estabelecida.");
            await pause(terminal);
            break;
          case "X":
            running = false;
            break;
        }
      } catch (error: unknown) {
        if (error instanceof yup.ValidationError) {
          console.log(`\n${error.message}`);
          await terminal.question("Pressione Enter para tentar novamente.");
          continue;
        }

        throw error;
      }

      // Continue a implementacao do menu neste switch, adicionando novas opcoes aqui.
    }
  } catch (error: unknown) {
    console.error("\nNao foi possivel executar a operacao:", error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    terminal.close();
  }
};

void start();
