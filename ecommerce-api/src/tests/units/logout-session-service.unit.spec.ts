import { SessionInvalidError } from "@/errors/session-invalid.error.js";
import { InMemoryMemcacheRepository } from "@/models/repositories/in-memory/memcache-repository.in-memory.js";
import { InMemorySessionsRepository } from "@/models/repositories/in-memory/sessions-repository.in-memory.js";
import { IMemcacheRepository } from "@/models/repositories/interfaces/memcache-repository.interface.js";
import type { ISessionsRepository } from "@/models/repositories/interfaces/sessions-repository.interface.js";
import { LogoutSessionService } from "@/services/sessions/logout-session.service.js";
import { hash } from "bcryptjs";
import dayjs from "dayjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let sessionsRepository: ISessionsRepository;
let memcacheRepository: IMemcacheRepository;
let sut: LogoutSessionService;

describe("Logout Session Service (Unit)", () => {
  beforeEach(() => {
    sessionsRepository = new InMemorySessionsRepository();
    memcacheRepository = new InMemoryMemcacheRepository();

    sut = new LogoutSessionService(sessionsRepository, memcacheRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to logout a session", async () => {
    vi.setSystemTime("2025-09-25T10:00:00Z");

    const sessionCreated = await sessionsRepository.create({
      user_id: "user-1",
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
    vi.setSystemTime("2025-09-25T10:00:00Z");

    const sessionCreated = await sessionsRepository.create({
      user_id: "user-1",
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
    await expect(() =>
      sut.execute({
        userId: "user-1",
        token: "token-here",
      }),
    ).rejects.toBeInstanceOf(SessionInvalidError);
  });
});
