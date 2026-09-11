import { AppDataSource } from "../../infra/database/data-source";
import { AuditLogEntity } from "../../infra/database/entities/audit-log.entity";
import { CollectEntity } from "../../infra/database/entities/collect.entity";
import { TypeOrmAuditLogRepository } from "../../infra/database/repositories/typeorm-audit-log.repository";
import { TypeOrmCollectRepository } from "../../infra/database/repositories/typeorm-collect.repository";
import { EventBus } from "../../shared/event-bus/event-bus";
import { CheckConnectionController } from "../../presentation/controllers/check-connection.controller";
import { CollectController } from "../../presentation/controllers/collect.controller";
import { ListAuditLogsController } from "../../presentation/controllers/list-audit-logs.controller";
import { CollectService } from "./collect.service";

export class CollectContainer {
  public readonly collectController: CollectController;
  public readonly listAuditLogsController: ListAuditLogsController;
  public readonly checkConnectionController: CheckConnectionController;

  constructor(private readonly eventBus: EventBus) {
    const repository = new TypeOrmCollectRepository(
      AppDataSource.getRepository(CollectEntity),
    );
    const collectService = new CollectService(repository, this.eventBus);

    const auditLogRepository = new TypeOrmAuditLogRepository(
      AppDataSource.getRepository(AuditLogEntity),
    );

    this.collectController = new CollectController(collectService);
    this.listAuditLogsController = new ListAuditLogsController(auditLogRepository);
    this.checkConnectionController = new CheckConnectionController();
  }
}
