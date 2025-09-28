import { prisma } from "@/configs/prisma.js";
import { RedisClient } from "@/configs/redis.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { IMemcacheRepository } from "@/models/repositories/interfaces/memcache-repository.interface.js";
import type { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { RedisMemcacheRepository } from "@/models/repositories/redis/memcache-repository.redis.js";
import { VerifyIfRevokedTokenService } from "@/services/sessions/verify-if-revoked-token.service.js";
import { hash } from "bcryptjs";
import type { Redis } from "ioredis";
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

let usersRepository: IUsersRepository;
let memcacheRepository: IMemcacheRepository;
let redis: Redis;
let sut: VerifyIfRevokedTokenService;

describe("Verify If Revoked Token Service (Integration)", () => {
  beforeEach(() => {
    redis = RedisClient.getClient("test");
    usersRepository = new PrismaUsersRepository();
    memcacheRepository = new RedisMemcacheRepository(redis);

    sut = new VerifyIfRevokedTokenService(usersRepository, memcacheRepository);

    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useRealTimers();

    await prisma.user.deleteMany();

    await redis.flushdb();
  });

  afterAll(async () => {
    await redis.quit();
  });

  it("should be able to verify revoked token is true", async () => {
    const userCreated = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    vi.setSystemTime("2025-09-25T11:00:00Z");

    await memcacheRepository.set({
      key: `revoked_list_${userCreated.id}`,
      value: "token-here",
      expireAt: 900,
    });

    vi.setSystemTime("2025-09-25T11:08:00Z");

    const response = await sut.execute({
      userId: userCreated.id,
      token: "token-here",
    });

    expect(response.isRevoked).toBeTruthy();
  });

  it("should be able to verify revoked token not exists is false", async () => {
    const userCreated = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const response = await sut.execute({
      userId: userCreated.id,
      token: "token-here",
    });

    expect(response.isRevoked).toBeFalsy();
  });

  it("should be able to verify revoked token is different", async () => {
    const userCreated = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    vi.setSystemTime("2025-09-25T11:00:00Z");

    await memcacheRepository.set({
      key: `revoked_list_${userCreated.id}`,
      value: "token-here-diff",
      expireAt: 900,
    });

    const response = await sut.execute({
      userId: userCreated.id,
      token: "token-here",
    });

    expect(response.isRevoked).toBeFalsy();
  });

  it("should not be able to verify if revoked token if user not exists", async () => {
    await expect(() =>
      sut.execute({
        userId: "user-1",
        token: "token-here",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
