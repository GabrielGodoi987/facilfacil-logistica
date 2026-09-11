import { CollectService } from "../../application/collect/collect.service";
import { CreateCollectDto } from "../../application/collect/dto/collect.dto";
import { CollectStatus } from "../../domain/collect/enum/collect-status.enum";
import { ask, askPriority, askStatus, Terminal } from "../helpers/terminal.helper";

export class CreateCollectController {
  constructor(private readonly collectService: CollectService) {}

  async execute(terminal: Terminal): Promise<void> {
    const data: CreateCollectDto = {
      name: await ask(terminal, "Nome: "),
      address: await ask(terminal, "Endereco: "),
      packages: await ask(terminal, "Pacotes: "),
      priority: await askPriority(terminal),
      status: await askStatus(terminal, CollectStatus.PENDING),
    };

    const collect = await this.collectService.create(data);

    console.log("\nColeta criada com sucesso:");
    console.log(JSON.stringify(collect, null, 2));
  }
}
