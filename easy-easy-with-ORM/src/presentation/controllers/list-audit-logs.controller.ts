import { IAuditLogRepository } from "../../domain/audit/repositories/audit-log.repository";
import { ask, Terminal } from "../helpers/terminal.helper";

export class ListAuditLogsController {
  constructor(private readonly auditLogRepository: IAuditLogRepository) {}

  async execute(terminal: Terminal): Promise<void> {
    const filter = await ask(
      terminal,
      "Filtrar por entityId (Enter para listar todos): ",
    );

    const logs = filter
      ? await this.auditLogRepository.findByEntityId("collect", filter)
      : await this.auditLogRepository.findAll();

    if (logs.length === 0) {
      console.log("\nNenhum log de auditoria encontrado.");
      return;
    }

    console.log(`\nTotal logs: ${logs.length}`);
    console.log(JSON.stringify(logs, null, 2));
  }
}
