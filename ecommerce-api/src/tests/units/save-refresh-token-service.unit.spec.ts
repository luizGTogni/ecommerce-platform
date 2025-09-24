import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { InMemoryUsersRepository } from "@/models/repositories/in-memory/users-repository.in-memory.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { SaveRefreshTokenService } from "@/services/users/save-refresh-token.service.js";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

let usersRepository: IUsersRepository;
let sut: SaveRefreshTokenService;
let spyFindById: MockInstance;

describe("Save Refresh Token Service (Unit)", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new SaveRefreshTokenService(usersRepository);
    spyFindById = vi.spyOn(usersRepository, "findById");
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

    expect(spyFindById).toHaveBeenCalledWith(user.id);
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
