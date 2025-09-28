import type { Redis } from "ioredis";
import {
  IMemcacheRepository,
  ISetProps,
} from "../interfaces/memcache-repository.interface.js";

export class RedisMemcacheRepository implements IMemcacheRepository {
  constructor(private readonly redis: Redis) {}

  async set({ key, value, expireAt }: ISetProps) {
    await this.redis.set(key, value);

    if (expireAt) {
      await this.redis.expire(key, expireAt);
    }
  }

  async get(key: string) {
    return await this.redis.get(key);
  }
}
