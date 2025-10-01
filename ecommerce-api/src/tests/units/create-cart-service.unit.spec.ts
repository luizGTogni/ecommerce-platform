import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { InMemoryCartsRepository } from "@/models/repositories/in-memory/carts-repository.in-memory.js";
import { InMemoryUsersRepository } from "@/models/repositories/in-memory/users-repository.in-memory.js";
import { ICartsRepository } from "@/models/repositories/interfaces/carts-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { CreateCartService } from "@/services/carts/create-cart.service.js";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";

let cartsRepository: ICartsRepository;
let usersRepository: IUsersRepository;
let sut: CreateCartService;

describe("Create Cart Service (Unit)", () => {
  beforeEach(() => {
    cartsRepository = new InMemoryCartsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new CreateCartService(cartsRepository, usersRepository);
  });

  it("should be able to create a cart", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const response = await sut.execute({
      userId: user.id,
    });

    expect(response.cart).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        user_id: user.id,
        status: "OPEN",
        finished_at: null,
        created_at: expect.any(Date),
      }),
    );
  });

  it("should not be able to create a cart if user not exists", async () => {
    await expect(() =>
      sut.execute({
        userId: "user-not-exists",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create a cart if cart already exists", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await sut.execute({
      userId: user.id,
    });

    const response = await sut.execute({
      userId: user.id,
    });

    expect(response.cart).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        user_id: user.id,
        status: "OPEN",
        finished_at: null,
        created_at: expect.any(Date),
      }),
    );
  });
});
