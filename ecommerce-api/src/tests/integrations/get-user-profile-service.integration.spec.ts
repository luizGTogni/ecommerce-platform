import { prisma } from "@/configs/prisma.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { GetUserProfileService } from "@/services/users/get-user-profile.service.js";
import { hash } from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

let usersRepository: IUsersRepository;
let sut: GetUserProfileService;

describe("Get User Profile Service (Integration)", () => {
  beforeEach(() => {
    usersRepository = new PrismaUsersRepository();
    sut = new GetUserProfileService(usersRepository);
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
  });

  it("should be able to get a user", async () => {
    const userCreated = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@xample.com",
      password_hash: await hash("123456", 6),
    });

    const response = await sut.execute({
      userId: userCreated.id,
    });

    expect(response.user).toEqual(userCreated);
  });

  it("should not be able to get a user if user not exists", async () => {
    await expect(() =>
      sut.execute({
        userId: "user-not-exists",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
