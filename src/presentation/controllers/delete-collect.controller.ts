import { CollectService } from "../../application/collect/collect.service";
import { askId, Terminal } from "../helpers/terminal.helper";

export class DeleteCollectController {
  constructor(private readonly collectService: CollectService) {}

  async execute(terminal: Terminal): Promise<void> {
    const result = await this.collectService.delete({ id: await askId(terminal) });

    console.log(
      result.deleted ? "\nColeta excluida." : "\nColeta nao encontrada.",
    );
  }
}
