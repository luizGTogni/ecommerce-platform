import { prisma } from "@/configs/prisma.js";
import { app } from "@/http/app.js";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user.js";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Add Product to Cart (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to add a product to cart", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const product = await prisma.product.create({
      data: {
        title: "Product 1",
        description: "",
        category: "Product Category 1",
        price: 58.95,
        quantity: 5,
        is_active: true,
      },
    });

    const response = await request(app.server)
      .post(`/cart/${product.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 2,
      });

    const cart = await prisma.cart.findFirst();

    const cartItem = await prisma.cartItem.findFirst();

    expect(response.statusCode).toEqual(201);
    expect(cart?.id).toEqual(expect.any(String));
    expect(cartItem).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        product_id: product.id,
        quantity: 2,
        unit_price: product.price,
        cart_id: cart?.id,
      }),
    );
  });
});
