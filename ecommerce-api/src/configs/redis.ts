import { Redis } from "ioredis";
import { env } from "./env.js";

export class RedisClient {
  private static instance: Redis | null = null;

  static getClient(mode: "dev" | "test" | null = null): Redis {
    if (!this.instance) {
      let db = env.REDIS_MODE === "test" ? 15 : 0;
      if (mode) {
        db = mode === "test" ? 15 : 0;
      }

      this.instance = new Redis({
        port: env.REDIS_PORT || 6379,
        password: env.REDIS_PASSWORD || "",
        db,
      });

      this.instance.on("error", (err) => console.error("Redis error:", err));
    }

    return this.instance;
  }
}
