import { prisma } from "@/configs/prisma.js";
import { app } from "@/http/app.js";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user.js";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Get Cart (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get the cart", async () => {
    const { token, user } = await createAndAuthenticateUser(app);

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

    await request(app.server)
      .post(`/carts/items`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 2,
        productId: product.id,
      });

    const cart = await prisma.cart.findFirst();
    const cartItem = await prisma.cartItem.findFirst();

    const response = await request(app.server)
      .get(`/carts/${cart?.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.total_price).toEqual(2 * 58.95);
    expect(response.body.total_products).toEqual(1);
    expect(response.body.cart).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        user_id: user.id,
        status: "OPEN",
        finished_at: null,
        cart_items: expect.arrayContaining([
          expect.objectContaining({
            id: cartItem?.id,
            unit_price: cartItem?.unit_price.toNumber(),
            quantity: cartItem?.quantity,
            product: expect.objectContaining({
              id: product.id,
              title: product.title,
              category: product.category,
              price: product.price.toNumber(),
              quantity: product.quantity,
            }),
          }),
        ]),
      }),
    );
  });
});
