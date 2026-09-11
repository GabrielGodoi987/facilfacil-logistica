export enum CollectPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum CollectStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELED = "canceled",
}

export interface Collect {
  id: string;
  name: string;
  address: string;
  packages: string;
  priority: CollectPriority;
  status: CollectStatus;
  createdAt: Date;
}
