import { prisma } from "@/configs/prisma.js";
import { ResourceAlreadyExistsError } from "@/errors/resource-already-exists.error.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { EditUserService } from "@/services/users/edit-user.service.js";
import { hash } from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

let usersRepository: IUsersRepository;
let sut: EditUserService;

describe("Edit User Service (Integration)", () => {
  beforeEach(() => {
    usersRepository = new PrismaUsersRepository();
    sut = new EditUserService(usersRepository);
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it("should be able to edit a user", async () => {
    const userCreated = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const response = await sut.execute({
      userId: userCreated.id,
      name: "Paul Doe",
      email: "pauldoe@example.com",
    });

    expect(response.user).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "Paul Doe",
        email: "pauldoe@example.com",
        session_hash: null,
        created_at: expect.any(Date),
      }),
    );
  });

  it("should not be able to edit a user if user not exists", async () => {
    await expect(() =>
      sut.execute({
        userId: "user_not_exists",
        name: "Paul Doe",
        email: "pauldoe@example.com",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to edit a user if email already exists", async () => {
    const userCreated = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await usersRepository.create({
      name: "Paul Doe",
      email: "pauldoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        userId: userCreated.id,
        name: "Paul Doe",
        email: "pauldoe@example.com",
      }),
    ).rejects.toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
