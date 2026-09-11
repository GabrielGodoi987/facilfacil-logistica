import { stdin as input, stdout as output } from "process";
import { createInterface } from "readline/promises";
import * as yup from "yup";
import { CollectContainer } from "./application/collect/collect.container";
import { LogEventsContainer } from "./infra/consumers/log/log-events.container";
import { AppDataSource } from "./infra/database/data-source";
import { AuditLogEntity } from "./infra/database/entities/audit-log.entity";
import { TypeOrmAuditLogRepository } from "./infra/database/repositories/typeorm-audit-log.repository";
import { pause } from "./presentation/helpers/terminal.helper";
import { EventBus } from "./shared/event-bus/event-bus";

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
  console.log("G. Listar logs de auditoria");
  console.log("X. Sair");
};

const menuOptionSchema = yup
  .string()
  .trim()
  .uppercase()
  .oneOf(["A", "B", "C", "D", "E", "F", "G", "X"], "Escolha uma opcao valida.")
  .required("Escolha uma opcao.");

const start = async (): Promise<void> => {
  const terminal = createInterface({ input, output });

  try {
    await AppDataSource.initialize();

    const eventBus = new EventBus();
    const auditLogRepository = new TypeOrmAuditLogRepository(
      AppDataSource.getRepository(AuditLogEntity),
    );

    new LogEventsContainer(auditLogRepository, eventBus);

    const collectContainer = new CollectContainer(eventBus);
    let running = true;

    while (running) {
      showMenu();
      const option = await terminal.question("\nEscolha uma opcao: ");

      try {
        const validOption = await menuOptionSchema.validate(option);

        switch (validOption) {
          case "A":
            await collectContainer.collectController.create(terminal);
            await pause(terminal);
            break;
          case "B":
            await collectContainer.collectController.list(terminal);
            await pause(terminal);
            break;
          case "C":
            await collectContainer.collectController.findById(terminal);
            await pause(terminal);
            break;
          case "D":
            await collectContainer.collectController.update(terminal);
            await pause(terminal);
            break;
          case "E":
            await collectContainer.collectController.delete(terminal);
            await pause(terminal);
            break;
          case "F":
            await collectContainer.checkConnectionController.execute(terminal);
            await pause(terminal);
            break;
          case "G":
            await collectContainer.listAuditLogsController.execute(terminal);
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
