import { JsonCollectRepository } from "../../infra/database/json-collect.repository";
import { CheckConnectionController } from "../../presentation/controllers/check-connection.controller";
import { CollectController } from "../../presentation/controllers/collect.controller";
import { CollectService } from "./collect.service";

export class CollectContainer {
  public readonly collectController: CollectController;
  public readonly checkConnectionController: CheckConnectionController;

  constructor() {
    const repository = new JsonCollectRepository();
    const collectService = new CollectService(repository);

    this.collectController = new CollectController(collectService);
    this.checkConnectionController = new CheckConnectionController();
  }
}
