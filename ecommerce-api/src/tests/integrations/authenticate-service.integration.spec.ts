import { prisma } from "@/configs/prisma.js";
import { BcryptHasherDriver } from "@/drivers/hasher/bcrypt.hasher.js";
import { IHasher } from "@/drivers/interfaces/hasher.interface.js";
import { InvalidCredentialsError } from "@/errors/invalid-credentials.error.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { AuthenticateService } from "@/services/users/authenticate.service.js";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

let usersRepository: IUsersRepository;
let hasherDriver: IHasher;
let sut: AuthenticateService;

describe("Authenticate Service (Integration)", () => {
  beforeEach(() => {
    usersRepository = new PrismaUsersRepository();
    hasherDriver = new BcryptHasherDriver();
    sut = new AuthenticateService(usersRepository, hasherDriver);
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
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
        password_hash: expect.any(String),
        created_at: expect.any(Date),
      }),
    );
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
