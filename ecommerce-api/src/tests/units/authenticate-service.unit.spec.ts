import {
  HashProps,
  IHasher,
  CompareProps,
} from "@/drivers/interfaces/hasher.interface.js";
import { InvalidCredentialsError } from "@/errors/invalid-credentials.error.js";
import { InMemoryUsersRepository } from "@/models/repositories/in-memory/users-repository.in-memory.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { AuthenticateService } from "@/services/users/authenticate.service.js";
import { beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

let usersRepository: IUsersRepository;
let hasherDriver: IHasher;
let sut: AuthenticateService;
let spyFindByEmail: MockInstance;

describe("Authenticate Service (Unit)", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    hasherDriver = {
      hash: vi.fn(async ({ plain }: HashProps) => `hashed-${plain}`),
      compare: vi.fn(
        async ({ plain, hashed }: CompareProps) => hashed === `hashed-${plain}`,
      ),
    };
    sut = new AuthenticateService(usersRepository, hasherDriver);
    spyFindByEmail = vi.spyOn(usersRepository, "findByEmail");
  });

  it("should be able to authenticate a user", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hasherDriver.hash({ plain: "123456" }),
    });

    const response = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(response.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "John Doe",
        email: "johndoe@example.com",
        password_hash: "hashed-123456",
        created_at: expect.any(Date),
      }),
    );

    expect(spyFindByEmail).toHaveBeenCalledWith("johndoe@example.com");
    expect(hasherDriver.compare).toHaveBeenCalledWith({
      plain: "123456",
      hashed: "hashed-123456",
    });
  });

  it("should not be able to authenticate a user if user not exists", async () => {
    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate a user if the passwords do not match", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hasherDriver.hash({ plain: "123456" }),
    });

    await expect(() =>
      sut.execute({
        email: "johndoe@example.com",
        password: "password_wrong",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
