import { prisma } from "@/configs/prisma.js";
import { BcryptHasherDriver } from "@/drivers/hasher/bcrypt.hasher.js";
import type { IHasher } from "@/drivers/interfaces/hasher.interface.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { SessionInvalidError } from "@/errors/session-invalid.error.js";
import type { ISessionsRepository } from "@/models/repositories/interfaces/sessions-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { PrismaSessionsRepository } from "@/models/repositories/prisma/sessions-repository.prisma.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { GetSessionService } from "@/services/sessions/get-session.service.js";
import { hash } from "bcryptjs";
import dayjs from "dayjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let usersRepository: IUsersRepository;
let sessionsRepository: ISessionsRepository;
let hasherDriver: IHasher;
let sut: GetSessionService;

describe("Get Session Service (Integration)", () => {
  beforeEach(() => {
    usersRepository = new PrismaUsersRepository();
    sessionsRepository = new PrismaSessionsRepository();
    hasherDriver = new BcryptHasherDriver();
    sut = new GetSessionService(
      usersRepository,
      sessionsRepository,
      hasherDriver,
    );

    vi.useFakeTimers();
  });

  afterEach(async () => {
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();

    vi.useRealTimers();
  });

  it("should be able to get a session valid", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    vi.setSystemTime("2025-09-25T10:00:00Z");

    const sessionCreated = await sessionsRepository.create({
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
        id: sessionCreated.id,
        user_id: user.id,
        token_hash: sessionCreated.token_hash,
        expires_at: sessionCreated.expires_at,
        created_at: sessionCreated.created_at,
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
