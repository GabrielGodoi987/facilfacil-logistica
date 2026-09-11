import { CollectService } from "../../application/collect/collect.service";
import { askId, Terminal } from "../helpers/terminal.helper";

export class FindCollectController {
  constructor(private readonly collectService: CollectService) {}

  async execute(terminal: Terminal): Promise<void> {
    const collect = await this.collectService.findById({
      id: await askId(terminal),
    });

    console.log(
      collect ? JSON.stringify(collect, null, 2) : "\nColeta nao encontrada.",
    );
  }
}
