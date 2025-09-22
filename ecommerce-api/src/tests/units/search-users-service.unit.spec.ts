import { InMemoryUsersRepository } from "@/models/repositories/in-memory/users-repository.in-memory.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { SearchUsersService } from "@/services/users/search-users.service.js";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it, MockInstance, vi } from "vitest";

let usersRepository: IUsersRepository;
let sut: SearchUsersService;
let spySearchMany: MockInstance;

describe("Search User Service (Unit)", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new SearchUsersService(usersRepository);
    spySearchMany = vi.spyOn(usersRepository, "searchMany");
  });

  it("should be able to search for users", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await usersRepository.create({
      name: "Paul Doe",
      email: "pauldoe@xample.com",
      password_hash: await hash("123456", 6),
    });

    const response = await sut.execute({ query: "John", page: 1 });

    expect(spySearchMany).toBeCalledWith("John", 1);
    expect(response.users).toHaveLength(1);
    expect(response.users).toEqual([
      expect.objectContaining({ email: "johndoe@example.com" }),
    ]);
  });

  it("should be able to fetch paginated users search", async () => {
    for (let i = 1; i <= 22; i++) {
      await usersRepository.create({
        name: `John Doe ${i}`,
        email: `johndoe${i}@example.com`,
        password_hash: await hash("123456", 6),
      });
    }

    const response = await sut.execute({ query: "John", page: 2 });

    expect(response.users).toHaveLength(2);
    expect(response.users).toEqual([
      expect.objectContaining({ email: "johndoe21@example.com" }),
      expect.objectContaining({ email: "johndoe22@example.com" }),
    ]);
  });
});
