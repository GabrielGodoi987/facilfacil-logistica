import { AggregateRoot } from "../../shared/aggregate-root";
import { CollectPriority } from "../enum/collect-priority.enum";
import { CollectStatus } from "../enum/collect-status.enum";
import { CollectCreatedEvent } from "../events/collect-created.event";
import { CollectDeletedEvent } from "../events/collect-deleted.event";
import { CollectStatusEvent } from "../events/collect-status.event";
import { CollectUpdatedEvent } from "../events/collect-updated.event";

export class Collect extends AggregateRoot {
  private constructor(
    public id: string,
    public name: string,
    public address: string,
    public packages: number,
    public priority: CollectPriority,
    public status: CollectStatus,
    public createdAt: Date,
  ) {
    super();
  }

  public static create(
    id: string,
    name: string,
    address: string,
    packages: number,
    priority: CollectPriority,
    status: CollectStatus = CollectStatus.PENDING,
    createdAt: Date = new Date(),
  ): Collect {
    const collect = new Collect(
      id,
      name,
      address,
      packages,
      priority,
      status,
      createdAt,
    );

    collect.addDomainEvent(new CollectCreatedEvent(collect));

    return collect;
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
    return new Collect(
      id,
      name,
      address,
      packages,
      priority,
      status,
      createdAt,
    );
  }

  public update(
    data: Partial<
      Pick<Collect, "name" | "address" | "packages" | "priority" | "status">
    >,
  ): void {
    const previous = Collect.reconstitute(
      this.id,
      this.name,
      this.address,
      this.packages,
      this.priority,
      this.status,
      this.createdAt,
    );
    const previousStatus = this.status;

    if (data.name !== undefined) this.name = data.name;
    if (data.address !== undefined) this.address = data.address;
    if (data.packages !== undefined) this.packages = data.packages;
    if (data.priority !== undefined) this.priority = data.priority;
    if (data.status !== undefined) this.status = data.status;

    const current = Collect.reconstitute(
      this.id,
      this.name,
      this.address,
      this.packages,
      this.priority,
      this.status,
      this.createdAt,
    );

    this.addDomainEvent(
      new CollectUpdatedEvent({ id: this.id, previous, current }),
    );

    if (data.status !== undefined && data.status !== previousStatus) {
      this.addDomainEvent(
        new CollectStatusEvent({
          id: this.id,
          previousStatus,
          currentStatus: data.status,
        }),
      );
    }
  }

  public changeStatus(newStatus: CollectStatus): void {}

  public markDeleted(): void {
    this.addDomainEvent(new CollectDeletedEvent({ id: this.id }));
  }
}
