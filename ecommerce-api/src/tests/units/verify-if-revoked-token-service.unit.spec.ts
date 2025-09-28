import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { InMemoryMemcacheRepository } from "@/models/repositories/in-memory/memcache-repository.in-memory.js";
import { InMemoryUsersRepository } from "@/models/repositories/in-memory/users-repository.in-memory.js";
import { IMemcacheRepository } from "@/models/repositories/interfaces/memcache-repository.interface.js";
import type { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { VerifyIfRevokedTokenService } from "@/services/sessions/verify-if-revoked-token.service.js";
import { hash } from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let usersRepository: IUsersRepository;
let memcacheRepository: IMemcacheRepository;
let sut: VerifyIfRevokedTokenService;

describe("Verify If Revoked Token Service (Unit)", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    memcacheRepository = new InMemoryMemcacheRepository();

    sut = new VerifyIfRevokedTokenService(usersRepository, memcacheRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it("should be able to verify revoked token is false", async () => {
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

    vi.setSystemTime("2025-09-25T15:01:00Z");

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
