import { prisma } from "@/configs/prisma.js";
import { BcryptHasherDriver } from "@/drivers/hasher/bcrypt.hasher.js";
import { IHasher } from "@/drivers/interfaces/hasher.interface.js";
import { ResourceAlreadyExistsError } from "@/errors/resource-already-exists.error.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { CreateUserService } from "@/services/users/create.service.js";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

let usersRepository: IUsersRepository;
let hasherDriver: IHasher;
let sut: CreateUserService;

describe("Create User Service (Integration)", () => {
  beforeEach(() => {
    usersRepository = new PrismaUsersRepository();
    hasherDriver = new BcryptHasherDriver();
    sut = new CreateUserService(usersRepository, hasherDriver);
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
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
        password_hash: expect.any(String),
        session_hash: null,
        created_at: expect.any(Date),
      }),
    );
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
