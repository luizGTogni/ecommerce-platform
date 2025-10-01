import { CartAlreadyFinishedError } from "@/errors/cart-already-finished.error.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { InMemoryCartItemsRepository } from "@/models/repositories/in-memory/cart-items-repository.in-memory.js";
import { InMemoryCartsRepository } from "@/models/repositories/in-memory/carts-repository.in-memory.js";
import { InMemoryUsersRepository } from "@/models/repositories/in-memory/users-repository.in-memory.js";
import { ICartItemsRepository } from "@/models/repositories/interfaces/cart-items-repository.interface.js";
import { ICartsRepository } from "@/models/repositories/interfaces/carts-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { RemoveCartItemService } from "@/services/carts/remove-cart-item.service.js";
import { Decimal } from "@prisma/client/runtime/library";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";

let cartItemsRepository: ICartItemsRepository;
let cartsRepository: ICartsRepository;
let usersRepository: IUsersRepository;
let sut: RemoveCartItemService;

describe("Remove Cart Item Service (Unit)", () => {
  beforeEach(() => {
    cartItemsRepository = new InMemoryCartItemsRepository();
    cartsRepository = new InMemoryCartsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new RemoveCartItemService(
      cartItemsRepository,
      cartsRepository,
      usersRepository,
    );
  });

  it("should be able to remove a cart item", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
      status: "OPEN",
    });

    const cartItem = await cartItemsRepository.create({
      cart_id: cart.id,
      product_id: "product-id",
      quantity: 2,
      unit_price: new Decimal(58.25),
    });

    await sut.execute({
      userId: user.id,
      cartItemId: cartItem.id,
    });

    const cartItemFounded = await cartItemsRepository.findById(cartItem.id);

    expect(cartItemFounded).toEqual(null);
  });

  it("should not be able to remove a cart item if user not exists", async () => {
    await expect(() =>
      sut.execute({
        userId: "user-not-exists",
        cartItemId: "cart-id",
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to remove a cart item if owner cart not same userId", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const user2 = await usersRepository.create({
      name: "Michael Doe",
      email: "michael@example.com",
      password_hash: await hash("123456", 6),
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
      status: "OPEN",
    });

    const cartItem = await cartItemsRepository.create({
      cart_id: cart.id,
      product_id: "product-id",
      quantity: 2,
      unit_price: new Decimal(58.25),
    });

    await expect(() =>
      sut.execute({
        userId: user2.id,
        cartItemId: cartItem.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to remove a cart item if cart status canceled or completed", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
      status: "CANCELED",
    });

    const cartItem = await cartItemsRepository.create({
      cart_id: cart.id,
      product_id: "product-id",
      quantity: 2,
      unit_price: new Decimal(58.25),
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        cartItemId: cartItem.id,
      }),
    ).rejects.toBeInstanceOf(CartAlreadyFinishedError);
  });
});
