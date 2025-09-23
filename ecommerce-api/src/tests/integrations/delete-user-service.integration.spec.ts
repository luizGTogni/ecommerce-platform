import { prisma } from "@/configs/prisma.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { DeleteUserService } from "@/services/users/delete-user.service.js";
import { hash } from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

let usersRepository: IUsersRepository;
let sut: DeleteUserService;

describe("Delete User Service (Integration)", () => {
  beforeEach(() => {
    usersRepository = new PrismaUsersRepository();
    sut = new DeleteUserService(usersRepository);
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it("should be able to delete a user", async () => {
    const userCreated = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await sut.execute({
      userId: userCreated.id,
    });

    const user = await usersRepository.findById(userCreated.id);

    expect(user).toEqual(null);
  });

  it("should not be able to delete a user if user not exists", async () => {
    await expect(() =>
      sut.execute({
        userId: "user_not_exists",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
