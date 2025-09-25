import type {
  CompareProps,
  HashProps,
  IHasher,
} from "@/drivers/interfaces/hasher.interface.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { SessionInvalidError } from "@/errors/session-invalid.error.js";
import { InMemorySessionsRepository } from "@/models/repositories/in-memory/sessions-repository.in-memory.js";
import { InMemoryUsersRepository } from "@/models/repositories/in-memory/users-repository.in-memory.js";
import type { ISessionsRepository } from "@/models/repositories/interfaces/sessions-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { GetSessionService } from "@/services/sessions/get-session.service.js";
import { hash } from "bcryptjs";
import dayjs from "dayjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let usersRepository: IUsersRepository;
let sessionsRepository: ISessionsRepository;
let hasherDriver: IHasher;
let sut: GetSessionService;

describe("Get Session Service (Unit)", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sessionsRepository = new InMemorySessionsRepository();
    hasherDriver = {
      hash: vi.fn(async ({ plain }: HashProps) => `hashed-${plain}`),
      compare: vi.fn(
        async ({ plain, hashed }: CompareProps) => hashed === `hashed-${plain}`,
      ),
    };
    sut = new GetSessionService(
      usersRepository,
      sessionsRepository,
      hasherDriver,
    );

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to get a session valid", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    vi.setSystemTime("2025-09-25T10:00:00Z");

    await sessionsRepository.create({
      user_id: user.id,
      token_hash: await hasherDriver.hash({
        plain: "refresh-token-here",
        salt: 8,
      }),
      expires_at: dayjs().add(7, "day").toDate(),
    });

    vi.setSystemTime("2025-10-02T09:30:00Z");

    const response = await sut.execute({
      userId: user.id,
      refreshToken: "refresh-token-here",
    });

    expect(response.session).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        user_id: user.id,
        token_hash: "hashed-refresh-token-here",
        expires_at: expect.any(Date),
        created_at: expect.any(Date),
      }),
    );
  });

  it("should not be able to get a session valid if user not exists", async () => {
    await expect(() =>
      sut.execute({
        userId: "user-not-exists",
        refreshToken: "refresh-token-here",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to get a session valid if session not exists", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        refreshToken: "refresh-token-here",
      }),
    ).rejects.toBeInstanceOf(SessionInvalidError);
  });

  it("should not be able to get a session valid if refresh token do not same", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await sessionsRepository.create({
      user_id: user.id,
      token_hash: await hasherDriver.hash({
        plain: "refresh-token-here",
        salt: 8,
      }),
      expires_at: dayjs().add(7, "day").toDate(),
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        refreshToken: "refresh-token-other",
      }),
    ).rejects.toBeInstanceOf(SessionInvalidError);
  });

  it("should not be able to get a session valid if expire-in at invalid", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    vi.setSystemTime("2025-09-25T10:00:00Z");

    await sessionsRepository.create({
      user_id: user.id,
      token_hash: await hasherDriver.hash({
        plain: "refresh-token-here",
        salt: 8,
      }),
      expires_at: dayjs().add(7, "day").toDate(),
    });

    vi.setSystemTime("2025-10-02T10:00:01Z");

    await expect(() =>
      sut.execute({
        userId: user.id,
        refreshToken: "refresh-token-here",
      }),
    ).rejects.toBeInstanceOf(SessionInvalidError);
  });
});
