import { HashProps, IHasher } from "@/drivers/interfaces/hasher.interface.js";
import { ResourceAlreadyExistsError } from "@/errors/resource-already-exists.error.js";
import { InMemoryUsersRepository } from "@/models/repositories/in-memory/users-repository.in-memory.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { CreateUserService } from "@/services/users/create.service.js";
import { beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

let usersRepository: IUsersRepository;
let hasherDriver: IHasher;
let sut: CreateUserService;
let spyCreate: MockInstance;
let spyFindByEmail: MockInstance;

describe("Create User Service (Unit)", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    hasherDriver = {
      hash: vi.fn(async ({ plain }: HashProps) => `hashed-${plain}`),
      compare: async () => true,
    };
    sut = new CreateUserService(usersRepository, hasherDriver);
    spyCreate = vi.spyOn(usersRepository, "create");
    spyFindByEmail = vi.spyOn(usersRepository, "findByEmail");
  });

  it("should be able to create a user", async () => {
    const response = await sut.execute({
      name: "John Doe",
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

    expect(spyCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "John Doe",
        email: "johndoe@example.com",
        password_hash: "hashed-123456",
      }),
    );

    expect(hasherDriver.hash).toHaveBeenCalledWith({
      plain: "123456",
    });
  });

  it("should not be able to create a user if email already exists", async () => {
    await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
