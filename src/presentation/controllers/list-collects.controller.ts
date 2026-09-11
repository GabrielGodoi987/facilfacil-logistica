import { CollectService } from "../../application/collect/collect.service";
import { PaginationDto } from "../../application/collect/dto/collect.dto";
import { ask, Terminal } from "../helpers/terminal.helper";

export class ListCollectsController {
  constructor(private readonly collectService: CollectService) {}

  async execute(terminal: Terminal): Promise<void> {
    const pagination: PaginationDto = {
      page: Number(await ask(terminal, "Pagina [1]: ")) || 1,
      limit: Number(await ask(terminal, "Itens por pagina [10]: ")) || 10,
    };

    const result = await this.collectService.findAll(pagination);

    console.log(
      `\nTotal: ${result.total} | Pagina ${result.page}/${result.totalPages || 1}`,
    );
    console.log(JSON.stringify(result.items, null, 2));
  }
}
