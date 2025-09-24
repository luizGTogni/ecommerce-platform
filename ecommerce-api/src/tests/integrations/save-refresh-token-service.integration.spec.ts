import { prisma } from "@/configs/prisma.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { SaveRefreshTokenService } from "@/services/users/save-refresh-token.service.js";
import { hash } from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

let usersRepository: IUsersRepository;
let sut: SaveRefreshTokenService;

describe("Save Refresh Token Service (Integration)", () => {
  beforeEach(() => {
    usersRepository = new PrismaUsersRepository();
    sut = new SaveRefreshTokenService(usersRepository);
  });

  afterEach(async () => {
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
    });

    expect(response.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "John Doe",
        email: "johndoe@example.com",
        password_hash: expect.any(String),
        session_hash: "refresh-token-here",
        created_at: expect.any(Date),
      }),
    );
  });

  it("should not be able to save refresh token if user not exists", async () => {
    await expect(() =>
      sut.execute({
        userId: "user-not-exists",
        refreshToken: "refresh-token-here",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
