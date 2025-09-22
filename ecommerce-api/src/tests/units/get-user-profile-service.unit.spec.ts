import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { InMemoryUsersRepository } from "@/models/repositories/in-memory/users-repository.in-memory.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { GetUserProfileService } from "@/services/users/get-user-profile.service.js";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

let usersRepository: IUsersRepository;
let sut: GetUserProfileService;
let spyFindById: MockInstance;

describe("Get User Profile Service (Unit)", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileService(usersRepository);
    spyFindById = vi.spyOn(usersRepository, "findById");
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

    expect(spyFindById).toBeCalledWith(userCreated.id);
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
