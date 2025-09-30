import { CartAlreadyFinishedError } from "@/errors/cart-already-finished.error.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { InMemoryCartsRepository } from "@/models/repositories/in-memory/carts-repository.in-memory.js";
import { InMemoryUsersRepository } from "@/models/repositories/in-memory/users-repository.in-memory.js";
import { ICartsRepository } from "@/models/repositories/interfaces/carts-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { UpdateStatusCartService } from "@/services/carts/update-status-cart.service.js";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";

let cartsRepository: ICartsRepository;
let usersRepository: IUsersRepository;
let sut: UpdateStatusCartService;

describe("Update Status Cart Service (Unit)", () => {
  beforeEach(() => {
    cartsRepository = new InMemoryCartsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new UpdateStatusCartService(cartsRepository, usersRepository);
  });

  it("should be able to update a status cart", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
    });

    const response = await sut.execute({
      userId: user.id,
      cartId: cart.id,
      newStatus: "COMPLETED",
    });

    expect(response.cart).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        user_id: user.id,
        status: "COMPLETED",
        finished_at: null,
        created_at: expect.any(Date),
      }),
    );
  });

  it("should not be able to update a status cart if user not exists", async () => {
    await expect(() =>
      sut.execute({
        userId: "user-not-exists",
        cartId: "cart-id",
        newStatus: "COMPLETED",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update a status cart if cart not exists", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        cartId: "cart-not-exists",
        newStatus: "COMPLETED",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update a status cart if owner cart not same userId", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
    });

    const user2 = await usersRepository.create({
      name: "Michael Doe",
      email: "michaeldoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        userId: user2.id,
        cartId: cart.id,
        newStatus: "COMPLETED",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update a status cart if cart status canceled or completed", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
    });

    sut.execute({
      userId: user.id,
      cartId: cart.id,
      newStatus: "COMPLETED",
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        cartId: cart.id,
        newStatus: "CANCELED",
      }),
    ).rejects.toBeInstanceOf(CartAlreadyFinishedError);
  });
});
