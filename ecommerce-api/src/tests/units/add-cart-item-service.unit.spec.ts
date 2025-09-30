import { CartAlreadyFinishedError } from "@/errors/cart-already-finished.error.js";
import { ProductOutOfStockError } from "@/errors/product-out-of-stock.error.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { InMemoryCartItemsRepository } from "@/models/repositories/in-memory/cart-items-repository.in-memory.js";
import { InMemoryCartsRepository } from "@/models/repositories/in-memory/carts-repository.in-memory.js";
import { InMemoryProductsRepository } from "@/models/repositories/in-memory/products-repository.in-memory.js";
import { InMemoryUsersRepository } from "@/models/repositories/in-memory/users-repository.in-memory.js";
import { ICartItemsRepository } from "@/models/repositories/interfaces/cart-items-repository.interface.js";
import { ICartsRepository } from "@/models/repositories/interfaces/carts-repository.interface.js";
import { IProductsRepository } from "@/models/repositories/interfaces/products-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { AddCartItemService } from "@/services/carts/add-cart-item.service.js";
import { Decimal } from "@prisma/client/runtime/library";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";

let cartItemsRepository: ICartItemsRepository;
let productsRepository: IProductsRepository;
let cartsRepository: ICartsRepository;
let usersRepository: IUsersRepository;
let sut: AddCartItemService;

describe("Add Cart Item Service (Unit)", () => {
  beforeEach(() => {
    cartItemsRepository = new InMemoryCartItemsRepository();
    productsRepository = new InMemoryProductsRepository();
    cartsRepository = new InMemoryCartsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new AddCartItemService(
      cartItemsRepository,
      productsRepository,
      cartsRepository,
      usersRepository,
    );
  });

  it("should be able to add a cart item", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
      status: "OPEN",
    });

    const product = await productsRepository.create({
      title: "Product 1",
      description: null,
      category: "Product Category 1",
      price: 58.95,
      quantity: 2,
      is_active: true,
    });

    const response = await sut.execute({
      userId: user.id,
      cartId: cart.id,
      productId: product.id,
      quantity: 2,
    });

    expect(response.cartItem).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        cart_id: cart.id,
        product_id: product.id,
        quantity: 2,
        unit_price: new Decimal(product.price),
      }),
    );
  });

  it("should not be able to add a cart item if user not exists", async () => {
    await expect(() =>
      sut.execute({
        userId: "user-not-exists",
        cartId: "cart-id",
        productId: "product-id",
        quantity: 2,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create a cart if cart not exists", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        cartId: "cart-not-exists",
        productId: "product-id",
        quantity: 2,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to add a cart item if product not exists", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
      status: "OPEN",
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        cartId: cart.id,
        productId: "product-not-exists",
        quantity: 2,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to add a cart item if owner cart not same userId", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
      status: "OPEN",
    });

    const product = await productsRepository.create({
      title: "Product 1",
      description: null,
      category: "Product Category 1",
      price: 58.95,
      quantity: 5,
      is_active: true,
    });

    await sut.execute({
      userId: user.id,
      cartId: cart.id,
      productId: product.id,
      quantity: 2,
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
        productId: product.id,
        quantity: 2,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to add a cart item if cart status canceled or completed", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
      status: "CANCELED",
    });

    const product = await productsRepository.create({
      title: "Product 1",
      description: null,
      category: "Product Category 1",
      price: 58.95,
      quantity: 5,
      is_active: true,
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        cartId: cart.id,
        productId: product.id,
        quantity: 4,
      }),
    ).rejects.toBeInstanceOf(CartAlreadyFinishedError);
  });

  it("should not be able to add a cart item if quantity insufficient stock", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
      status: "OPEN",
    });

    const product = await productsRepository.create({
      title: "Product 1",
      description: null,
      category: "Product Category 1",
      price: 58.95,
      quantity: 2,
      is_active: true,
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        cartId: cart.id,
        productId: product.id,
        quantity: 4,
      }),
    ).rejects.toBeInstanceOf(ProductOutOfStockError);
  });

  it("should not be able to add a cart item if product not active", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
      status: "OPEN",
    });

    const product = await productsRepository.create({
      title: "Product 1",
      description: null,
      category: "Product Category 1",
      price: 58.95,
      quantity: 10,
      is_active: false,
    });

    await expect(() =>
      sut.execute({
        userId: user.id,
        cartId: cart.id,
        productId: product.id,
        quantity: 4,
      }),
    ).rejects.toBeInstanceOf(ProductOutOfStockError);
  });

  it("should be able to add a cart item if cart item already exists, but only updated quantity", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const cart = await cartsRepository.create({
      user_id: user.id,
      status: "OPEN",
    });

    const product = await productsRepository.create({
      title: "Product 1",
      description: null,
      category: "Product Category 1",
      price: 58.95,
      quantity: 10,
      is_active: true,
    });

    const responseCartItemCreated = await sut.execute({
      userId: user.id,
      cartId: cart.id,
      productId: product.id,
      quantity: 4,
    });

    expect(responseCartItemCreated.cartItem).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        cart_id: cart.id,
        product_id: product.id,
        quantity: 4,
        unit_price: new Decimal(product.price),
      }),
    );

    const responseCartItemUpdated = await sut.execute({
      userId: user.id,
      cartId: cart.id,
      productId: product.id,
      quantity: 5,
    });

    expect(responseCartItemUpdated.cartItem).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        cart_id: cart.id,
        product_id: product.id,
        quantity: 5,
        unit_price: new Decimal(product.price),
      }),
    );
  });
});
