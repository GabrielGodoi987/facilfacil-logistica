import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";
import { Collect } from "../../domain/collect/entities/collect";
import { CollectStatus } from "../../domain/collect/enum/collect-status.enum";
import {
  CollectPage,
  CollectRepository,
  CreateCollectData,
  UpdateCollectData,
} from "../../domain/collect/repositories/collect.repository";

interface StoredCollect {
  id: string;
  name: string;
  address: string;
  packages: number;
  priority: string;
  status: string;
  createdAt: string;
}

interface DatabaseFile {
  collects: StoredCollect[];
}

export class JsonCollectRepository implements CollectRepository {
  private readonly filePath: string;

  constructor(filePath?: string) {
    this.filePath =
      filePath ?? path.resolve(__dirname, "../../../data/database.json");
    this.ensureFile();
  }

  private ensureFile(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      const initial: DatabaseFile = { collects: [] };
      fs.writeFileSync(this.filePath, JSON.stringify(initial, null, 2), "utf-8");
    }
  }

  private read(): DatabaseFile {
    this.ensureFile();
    const raw = fs.readFileSync(this.filePath, "utf-8");
    try {
      const parsed = JSON.parse(raw) as DatabaseFile;
      if (!parsed.collects || !Array.isArray(parsed.collects)) {
        return { collects: [] };
      }
      return parsed;
    } catch {
      return { collects: [] };
    }
  }

  private write(data: DatabaseFile): void {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  private toDomain(stored: StoredCollect): Collect {
    return Collect.reconstitute(
      stored.id,
      stored.name,
      stored.address,
      stored.packages,
      stored.priority as Collect["priority"],
      stored.status as Collect["status"],
      new Date(stored.createdAt),
    );
  }

  private toStored(collect: Collect): StoredCollect {
    return {
      id: collect.id,
      name: collect.name,
      address: collect.address,
      packages: collect.packages,
      priority: collect.priority,
      status: collect.status,
      createdAt: collect.createdAt.toISOString(),
    };
  }

  async create(data: CreateCollectData): Promise<Collect> {
    const db = this.read();
    const collect = Collect.create(
      data.id ?? randomUUID(),
      data.name,
      data.address,
      data.packages,
      data.priority,
      data.status ?? CollectStatus.PENDING,
      data.createdAt ?? new Date(),
    );

    db.collects.push(this.toStored(collect));
    this.write(db);

    return collect;
  }

  async findById(id: string): Promise<Collect | null> {
    const db = this.read();
    const found = db.collects.find((c) => c.id === id);
    return found ? this.toDomain(found) : null;
  }

  async findAll(page: number, limit: number): Promise<CollectPage> {
    const db = this.read();
    const sorted = [...db.collects].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const total = sorted.length;
    const start = (page - 1) * limit;
    const paginated = sorted.slice(start, start + limit);

    return {
      items: paginated.map((c) => this.toDomain(c)),
      total,
    };
  }

  async update(id: string, data: UpdateCollectData): Promise<Collect | null> {
    const db = this.read();
    const index = db.collects.findIndex((c) => c.id === id);

    if (index === -1) {
      return null;
    }

    const existing = this.toDomain(db.collects[index]);
    existing.update(data);

    db.collects[index] = this.toStored(existing);
    this.write(db);

    return existing;
  }

  async delete(id: string): Promise<boolean> {
    const db = this.read();
    const initialLength = db.collects.length;
    db.collects = db.collects.filter((c) => c.id !== id);

    if (db.collects.length === initialLength) {
      return false;
    }

    this.write(db);
    return true;
  }
}
