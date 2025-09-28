import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { InMemorySessionsRepository } from "@/models/repositories/in-memory/sessions-repository.in-memory.js";
import { InMemoryUsersRepository } from "@/models/repositories/in-memory/users-repository.in-memory.js";
import type { ISessionsRepository } from "@/models/repositories/interfaces/sessions-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { DeleteUserService } from "@/services/users/delete-user.service.js";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

let usersRepository: IUsersRepository;
let sessionsRepository: ISessionsRepository;
let sut: DeleteUserService;
let spyFindById: MockInstance;

describe("Delete User Service (Unit)", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sessionsRepository = new InMemorySessionsRepository();
    sut = new DeleteUserService(usersRepository, sessionsRepository);
    spyFindById = vi.spyOn(usersRepository, "findById");
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

    expect(spyFindById).toHaveBeenCalledWith(userCreated.id);
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
