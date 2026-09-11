import { Collect } from "../entities/collect";
import { CollectPriority } from "../enum/collect-priority.enum";
import { CollectStatus } from "../enum/collect-status.enum";

export interface CreateCollectData {
  id?: string;
  name: string;
  address: string;
  packages: number;
  priority: CollectPriority;
  status?: CollectStatus;
  createdAt?: Date;
}

export interface UpdateCollectData {
  name?: string;
  address?: string;
  packages?: number;
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
