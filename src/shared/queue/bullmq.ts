import { Queue } from "bullmq";
import "dotenv/config";

export const redisConnection = {
  host: process.env.REDIS_HOST ?? "localhost",
  port: Number(process.env.REDIS_PORT ?? 6379),
  maxRetriesPerRequest: null,
};

export const collectQueue = new Queue("collect", {
  connection: redisConnection,
});
