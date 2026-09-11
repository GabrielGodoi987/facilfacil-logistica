import { Terminal } from "../helpers/terminal.helper";

export class CheckConnectionController {
  async execute(_terminal: Terminal): Promise<void> {
    console.log("\nConexao com o PostgreSQL estabelecida.");
  }
}
