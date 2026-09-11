import { stdin as input, stdout as output } from "process";
import { createInterface } from "readline/promises";
import * as yup from "yup";
import { CollectContainer } from "./application/collect/collect.container";
import { pause } from "./presentation/helpers/terminal.helper";

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
  console.log("\nfacilfacil-logistica (JSON Database)\n");
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

const start = async (): Promise<void> => {
  const terminal = createInterface({ input, output });

  try {
    const collectContainer = new CollectContainer();
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
    terminal.close();
  }
};

void start();
