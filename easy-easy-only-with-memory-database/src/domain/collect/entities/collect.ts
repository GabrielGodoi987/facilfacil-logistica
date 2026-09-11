import { CollectPriority } from "../enum/collect-priority.enum";
import { CollectStatus } from "../enum/collect-status.enum";

export class Collect {
  private constructor(
    public id: string,
    public name: string,
    public address: string,
    public packages: number,
    public priority: CollectPriority,
    public status: CollectStatus,
    public createdAt: Date,
  ) {}

  public static create(
    id: string,
    name: string,
    address: string,
    packages: number,
    priority: CollectPriority,
    status: CollectStatus = CollectStatus.PENDING,
    createdAt: Date = new Date(),
  ): Collect {
    return new Collect(id, name, address, packages, priority, status, createdAt);
  }

  public static reconstitute(
    id: string,
    name: string,
    address: string,
    packages: number,
    priority: CollectPriority,
    status: CollectStatus,
    createdAt: Date,
  ): Collect {
    return new Collect(id, name, address, packages, priority, status, createdAt);
  }

  public update(
    data: Partial<Pick<Collect, "name" | "address" | "packages" | "priority" | "status">>,
  ): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.address !== undefined) this.address = data.address;
    if (data.packages !== undefined) this.packages = data.packages;
    if (data.priority !== undefined) this.priority = data.priority;
    if (data.status !== undefined) this.status = data.status;
  }
}
