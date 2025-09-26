import {
  IMemcacheRepository,
  ISetProps,
} from "../interfaces/memcache-repository.interface.js";
import { RedisClientType } from "redis";

export class RedisMemcacheRepository implements IMemcacheRepository {
  constructor(private readonly redisConn: RedisClientType) {}

  async set({ key, value, configs }: ISetProps) {
    await this.redisConn.set(key, value, {
      expiration: configs ? { type: "EX", value: configs.EX } : undefined,
    });
  }

  async get(key: string) {
    return await this.redisConn.get(key);
  }
}
