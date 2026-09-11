import * as fs from "fs";
import * as path from "path";
import { Terminal } from "../helpers/terminal.helper";

export class CheckConnectionController {
  async execute(_terminal: Terminal): Promise<void> {
    const filePath = path.resolve(__dirname, "../../../data/database.json");

    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, "utf-8");
        JSON.parse(raw);
        console.log("\nConexao com o banco JSON estabelecida.");
        console.log(`Arquivo: ${filePath}`);
      } else {
        console.log("\nArquivo de banco JSON ainda nao existe. Sera criado automaticamente na proxima operacao.");
        console.log(`Caminho esperado: ${filePath}`);
      }
    } catch (error) {
      console.log("\nFalha ao verificar o banco JSON:", error);
    }
  }
}
