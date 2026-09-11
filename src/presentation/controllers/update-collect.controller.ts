import { CollectService } from "../../application/collect/collect.service";
import { UpdateCollectDto } from "../../application/collect/dto/collect.dto";
import { ask, askId, Terminal } from "../helpers/terminal.helper";
import { prioritySchema, statusSchema } from "../helpers/terminal.helper";

export class UpdateCollectController {
  constructor(private readonly collectService: CollectService) {}

  async execute(terminal: Terminal): Promise<void> {
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

    const collect = await this.collectService.update({ id }, data);

    console.log(
      collect ? JSON.stringify(collect, null, 2) : "\nColeta nao encontrada.",
    );
  }
}
