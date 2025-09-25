import { prisma } from "@/configs/prisma.js";
import { BcryptHasherDriver } from "@/drivers/hasher/bcrypt.hasher.js";
import { IHasher } from "@/drivers/interfaces/hasher.interface.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { ISessionsRepository } from "@/models/repositories/interfaces/sessions-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { PrismaSessionsRepository } from "@/models/repositories/prisma/sessions-repository.prisma.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { SaveRefreshTokenService } from "@/services/sessions/save-refresh-token.service.js";
import { hash } from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

let usersRepository: IUsersRepository;
let sessionsRepository: ISessionsRepository;
let hasherDriver: IHasher;
let sut: SaveRefreshTokenService;

describe("Save Refresh Token Service (Integration)", () => {
  beforeEach(() => {
    usersRepository = new PrismaUsersRepository();
    sessionsRepository = new PrismaSessionsRepository();
    hasherDriver = new BcryptHasherDriver();
    sut = new SaveRefreshTokenService(
      usersRepository,
      sessionsRepository,
      hasherDriver,
    );
  });

  afterEach(async () => {
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
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
        token_hash: expect.any(String),
        expires_at: expect.any(Date),
        created_at: expect.any(Date),
      }),
    );
  });

  it("should be able to save refresh token and update revoked to true session previous", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const sessionPrevious = await sut.execute({
      userId: user.id,
      refreshToken: "refresh-token-here",
      expiresAt: new Date(),
    });

    expect(sessionPrevious.session.revoked).toEqual(false);

    const sessionCurrent = await sut.execute({
      userId: user.id,
      refreshToken: "refresh-token-here-2",
      expiresAt: new Date(),
    });

    const sessionPreviousUpdated = await prisma.session.findUnique({
      where: { id: sessionPrevious.session.id },
    });

    expect(sessionPreviousUpdated?.revoked).toEqual(true);
    expect(sessionCurrent.session.revoked).toEqual(false);
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
