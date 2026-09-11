import { stdin as input, stdout as output } from "process";
import { createInterface } from "readline/promises";
import * as yup from "yup";
import { AppDataSource } from "./infra/database/data-source";

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
  console.log("1. Verificar conexao com o banco");
  console.log("0. Sair");
};

const menuOptionSchema = yup
  .string()
  .trim()
  .oneOf(["1", "0"], "Escolha uma opcao valida: 1 ou 0.")
  .required("Escolha uma opcao.");

const start = async (): Promise<void> => {
  const terminal = createInterface({ input, output });

  try {
    let running = true;

    while (running) {
      showMenu();
      const option = await terminal.question("\nEscolha uma opcao: ");

      try {
        const validOption = await menuOptionSchema.validate(option);

        switch (validOption) {
          case "1":
            await AppDataSource.initialize();
            console.log("\nConexao com o PostgreSQL estabelecida.");
            await AppDataSource.destroy();
            await terminal.question("\nPressione Enter para voltar ao menu.");
            break;
          case "0":
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
    terminal.close();
  }
};

void start();
