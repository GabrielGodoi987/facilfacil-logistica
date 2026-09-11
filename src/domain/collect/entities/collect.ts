import { CollectPriority } from "../enum/collect-priority.enum";
import { CollectStatus } from "../enum/collect-status.enum";

export class Collect {
  constructor(
    public id: string,
    public name: string,
    public address: string,
    public packages: string,
    public priority: CollectPriority,
    public status: CollectStatus,
    public createdAt: Date,
  ) {}
}
