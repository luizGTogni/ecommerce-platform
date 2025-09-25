import { ResourceAlreadyExistsError } from "@/errors/resource-already-exists.error.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { InMemoryUsersRepository } from "@/models/repositories/in-memory/users-repository.in-memory.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { EditUserService } from "@/services/users/edit-user.service.js";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

let usersRepository: IUsersRepository;
let sut: EditUserService;
let spyFindByEmail: MockInstance;
let spyFindById: MockInstance;

describe("Edit User Service (Unit)", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new EditUserService(usersRepository);
    spyFindByEmail = vi.spyOn(usersRepository, "findByEmail");
    spyFindById = vi.spyOn(usersRepository, "findById");
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
        created_at: expect.any(Date),
      }),
    );

    expect(spyFindByEmail).toHaveBeenCalledWith("pauldoe@example.com");
    expect(spyFindById).toHaveBeenCalledWith(userCreated.id);
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
