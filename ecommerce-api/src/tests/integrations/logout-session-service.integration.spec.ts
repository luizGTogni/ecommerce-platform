import { prisma } from "@/configs/prisma.js";
import { redis } from "@/configs/redis.js";
import { SessionInvalidError } from "@/errors/session-invalid.error.js";
import { IMemcacheRepository } from "@/models/repositories/interfaces/memcache-repository.interface.js";
import type { ISessionsRepository } from "@/models/repositories/interfaces/sessions-repository.interface.js";
import { PrismaSessionsRepository } from "@/models/repositories/prisma/sessions-repository.prisma.js";
import { RedisMemcacheRepository } from "@/models/repositories/redis/memcache-repository.redis.js";
import { LogoutSessionService } from "@/services/sessions/logout-session.service.js";
import { hash } from "bcryptjs";
import dayjs from "dayjs";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

let sessionsRepository: ISessionsRepository;
let memcacheRepository: IMemcacheRepository;
let sut: LogoutSessionService;

describe("Logout Session Service (Integration)", () => {
  beforeAll(async () => {
    await redis.connect("TEST");
  });

  beforeEach(async () => {
    const client = await redis.getClient();
    sessionsRepository = new PrismaSessionsRepository();
    memcacheRepository = new RedisMemcacheRepository(client);

    sut = new LogoutSessionService(sessionsRepository, memcacheRepository);

    vi.useFakeTimers();
  });

  afterEach(async () => {
    vi.useRealTimers();

    await redis.clearAll();

    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await redis.quit();
  });

  it("should be able to logout a session", async () => {
    const userCreated = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        password_hash: await hash("123456", 6),
      },
    });

    vi.setSystemTime("2025-09-25T10:00:00Z");

    const sessionCreated = await sessionsRepository.create({
      user_id: userCreated.id,
      token_hash: await hash("refresh-token-here", 8),
      expires_at: dayjs().add(7, "day").toDate(),
    });

    vi.setSystemTime("2025-09-25T11:00:00Z");

    const response = await sut.execute({
      userId: sessionCreated.user_id,
      token: "token-here",
    });

    expect(response.session).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        user_id: sessionCreated.user_id,
        token_hash: sessionCreated.token_hash,
        expires_at: sessionCreated.expires_at,
        created_at: sessionCreated.created_at,
        revoked: true,
      }),
    );

    const responseCached = await memcacheRepository.get(
      `revoked_list_${sessionCreated.id}`,
    );

    expect(responseCached).toEqual("token-here");
  });

  it("should be able to logout a session and after 15 minutes remove to revoked list", async () => {
    const userCreated = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        password_hash: await hash("123456", 6),
      },
    });

    vi.setSystemTime("2025-09-25T10:00:00Z");

    const sessionCreated = await sessionsRepository.create({
      user_id: userCreated.id,
      token_hash: await hash("refresh-token-here", 8),
      expires_at: dayjs().add(7, "day").toDate(),
    });

    vi.setSystemTime("2025-09-25T11:00:00Z");

    const response = await sut.execute({
      userId: sessionCreated.user_id,
      token: "token-here",
    });

    expect(response.session).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        user_id: sessionCreated.user_id,
        token_hash: sessionCreated.token_hash,
        expires_at: sessionCreated.expires_at,
        created_at: sessionCreated.created_at,
        revoked: true,
      }),
    );

    vi.setSystemTime("2025-09-25T11:15:01Z");

    const responseCached = await memcacheRepository.get(
      `revoked_list_${sessionCreated.id}`,
    );

    expect(responseCached).toEqual(null);
  });

  it("should not be able to logout a session if session not exists", async () => {
    const userCreated = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        password_hash: await hash("123456", 6),
      },
    });

    await expect(() =>
      sut.execute({
        userId: userCreated.id,
        token: "token-here",
      }),
    ).rejects.toBeInstanceOf(SessionInvalidError);
  });
});
