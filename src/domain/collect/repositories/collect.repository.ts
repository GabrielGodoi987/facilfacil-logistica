import { Collect, CollectPriority, CollectStatus } from "../entities/collect";

export interface CreateCollectData {
  name: string;
  address: string;
  packages: string;
  priority: CollectPriority;
  status?: CollectStatus;
  createdAt?: Date;
}

export interface UpdateCollectData {
  name?: string;
  address?: string;
  packages?: string;
  priority?: CollectPriority;
  status?: CollectStatus;
}

export interface CollectPage {
  items: Collect[];
  total: number;
}

export interface CollectRepository {
  create(data: CreateCollectData): Promise<Collect>;
  findById(id: string): Promise<Collect | null>;
  findAll(page: number, limit: number): Promise<CollectPage>;
  update(id: string, data: UpdateCollectData): Promise<Collect | null>;
  delete(id: string): Promise<boolean>;
}
