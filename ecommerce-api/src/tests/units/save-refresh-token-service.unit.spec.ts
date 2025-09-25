import type {
  CompareProps,
  HashProps,
  IHasher,
} from "@/drivers/interfaces/hasher.interface.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { InMemorySessionsRepository } from "@/models/repositories/in-memory/sessions-repository.in-memory.js";
import { InMemoryUsersRepository } from "@/models/repositories/in-memory/users-repository.in-memory.js";
import type { ISessionsRepository } from "@/models/repositories/interfaces/sessions-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { SaveRefreshTokenService } from "@/services/users/save-refresh-token.service.js";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

let usersRepository: IUsersRepository;
let sessionsRepository: ISessionsRepository;
let hasherDriver: IHasher;
let sut: SaveRefreshTokenService;

describe("Save Refresh Token Service (Unit)", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sessionsRepository = new InMemorySessionsRepository();
    hasherDriver = hasherDriver = {
      hash: vi.fn(async ({ plain }: HashProps) => `hashed-${plain}`),
      compare: vi.fn(
        async ({ plain, hashed }: CompareProps) => hashed === `hashed-${plain}`,
      ),
    };
    sut = new SaveRefreshTokenService(
      usersRepository,
      sessionsRepository,
      hasherDriver,
    );
  });

  it("should be able to save refresh token", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const response = await sut.execute({
      userId: user.id,
      refreshToken: "refresh-token-here",
      expiresAt: new Date(),
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

  it("should not be able to save refresh token if user not exists", async () => {
    await expect(() =>
      sut.execute({
        userId: "user-not-exists",
        refreshToken: "refresh-token-here",
        expiresAt: new Date(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
