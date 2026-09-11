import { Repository } from "typeorm";
import { Collect } from "../../../domain/collect/entities/collect";
import { CollectStatus } from "../../../domain/collect/enum/collect-status.enum";
import {
  CollectPage,
  CollectRepository,
  CreateCollectData,
  UpdateCollectData,
} from "../../../domain/collect/repositories/collect.repository";
import { CollectEntity } from "../entities/collect.entity";

export class TypeOrmCollectRepository implements CollectRepository {
  constructor(private readonly repository: Repository<CollectEntity>) {}

  async create(data: CreateCollectData): Promise<Collect> {
    const entity = this.repository.create({
      ...data,
      status: data.status ?? CollectStatus.PENDING,
    });

    return this.toDomain(await this.repository.save(entity));
  }

  async findById(id: string): Promise<Collect | null> {
    const entity = await this.repository.findOneBy({ id });

    return entity ? this.toDomain(entity) : null;
  }

  async findAll(page: number, limit: number): Promise<CollectPage> {
    const [entities, total] = await this.repository.findAndCount({
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: entities.map((entity) => this.toDomain(entity)),
      total,
    };
  }

  async update(id: string, data: UpdateCollectData): Promise<Collect | null> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      return null;
    }

    Object.assign(entity, data);

    return this.toDomain(await this.repository.save(entity));
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);

    return result.affected === 1;
  }

  private toDomain(entity: CollectEntity): Collect {
    return new Collect(
      entity.id,
      entity.name,
      entity.address,
      entity.packages,
      entity.priority,
      entity.status,
      entity.createdAt,
    );
  }
}
