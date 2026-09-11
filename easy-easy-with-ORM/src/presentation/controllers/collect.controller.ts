import { CollectService } from "../../application/collect/collect.service";
import {
  CreateCollectDto,
  PaginationDto,
  UpdateCollectDto,
} from "../../application/collect/dto/collect.dto";
import { CollectStatus } from "../../domain/collect/enum/collect-status.enum";
import {
  ask,
  askId,
  askPriority,
  askStatus,
  prioritySchema,
  statusSchema,
  Terminal,
} from "../helpers/terminal.helper";

export class CollectController {
  constructor(private readonly collectService: CollectService) {}

  async create(terminal: Terminal): Promise<void> {
    const data: CreateCollectDto = {
      name: await ask(terminal, "Nome: "),
      address: await ask(terminal, "Endereco: "),
      packages: Number(await ask(terminal, "Pacotes: ")),
      priority: await askPriority(terminal),
      status: await askStatus(terminal, CollectStatus.PENDING),
    };

    const collect = await this.collectService.create(data);

    console.log("\nColeta criada com sucesso:");
    console.log(JSON.stringify(collect, null, 2));
  }

  async list(terminal: Terminal): Promise<void> {
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

  async findById(terminal: Terminal): Promise<void> {
    const collect = await this.collectService.findById({
      id: await askId(terminal),
    });

    console.log(
      collect ? JSON.stringify(collect, null, 2) : "\nColeta nao encontrada.",
    );
  }

  async update(terminal: Terminal): Promise<void> {
    const id = await askId(terminal);

    const data: UpdateCollectDto = {};
    const name = await ask(terminal, "Nome (Enter para manter): ");
    const address = await ask(terminal, "Endereco (Enter para manter): ");
    const packages = await ask(terminal, "Pacotes (Enter para manter): ");
    const priority = await ask(terminal, "Prioridade (Enter para manter): ");
    const status = await ask(terminal, "Status (Enter para manter): ");

    if (name) data.name = name;
    if (address) data.address = address;
    if (packages) data.packages = Number(packages);
    if (priority) data.priority = await prioritySchema.validate(priority);
    if (status) data.status = await statusSchema.validate(status);

    const collect = await this.collectService.update({ id }, data);

    console.log(
      collect ? JSON.stringify(collect, null, 2) : "\nColeta nao encontrada.",
    );
  }

  async delete(terminal: Terminal): Promise<void> {
    const result = await this.collectService.delete({
      id: await askId(terminal),
    });

    console.log(
      result.deleted ? "\nColeta excluida." : "\nColeta nao encontrada.",
    );
  }
}
