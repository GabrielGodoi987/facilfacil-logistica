import { AppDataSource } from "../../infra/database/data-source";
import { CollectEntity } from "../../infra/database/entities/collect.entity";
import { TypeOrmCollectRepository } from "../../infra/database/repositories/typeorm-collect.repository";
import { CheckConnectionController } from "../../presentation/controllers/check-connection.controller";
import { CreateCollectController } from "../../presentation/controllers/create-collect.controller";
import { DeleteCollectController } from "../../presentation/controllers/delete-collect.controller";
import { FindCollectController } from "../../presentation/controllers/find-collect.controller";
import { ListCollectsController } from "../../presentation/controllers/list-collects.controller";
import { UpdateCollectController } from "../../presentation/controllers/update-collect.controller";
import { CollectService } from "./collect.service";

export class CollectContainer {
  public readonly createCollectController: CreateCollectController;
  public readonly listCollectsController: ListCollectsController;
  public readonly findCollectController: FindCollectController;
  public readonly updateCollectController: UpdateCollectController;
  public readonly deleteCollectController: DeleteCollectController;
  public readonly checkConnectionController: CheckConnectionController;

  constructor() {
    const repository = new TypeOrmCollectRepository(
      AppDataSource.getRepository(CollectEntity),
    );
    const collectService = new CollectService(repository);

    this.createCollectController = new CreateCollectController(collectService);
    this.listCollectsController = new ListCollectsController(collectService);
    this.findCollectController = new FindCollectController(collectService);
    this.updateCollectController = new UpdateCollectController(collectService);
    this.deleteCollectController = new DeleteCollectController(collectService);
    this.checkConnectionController = new CheckConnectionController();
  }
}
