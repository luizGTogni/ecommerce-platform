import { createClient, RedisClientType } from "redis";
import { env } from "./env.js";

class RedisClient {
  private readonly client: RedisClientType;

  constructor() {
    this.client = createClient({ url: env.REDIS_URL });
    this.client.on("error", (err) => console.log("Redis Error:", err));
  }

  async connect(redisDb: "PROD" | "TEST" = "PROD") {
    if (!this.client.isOpen) {
      await this.client.connect();
      await this.client.select(redisDb === "PROD" ? 0 : 15);
    }
  }

  async getClient() {
    if (!this.client.isOpen) {
      return this.client;
    }
  }

  async clearAll() {
    if (!this.client.isOpen) {
      await this.client.flushDb();
    }
  }

  async quit() {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }
}

export const redis = new RedisClient();
