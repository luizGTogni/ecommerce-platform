import { prisma } from "@/configs/prisma.js";
import { app } from "@/http/app.js";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user.js";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Update Product to Cart (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to update a product to cart", async () => {
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

    await request(app.server)
      .post(`/cart/${product.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 2,
      });

    const cartItem = await prisma.cartItem.findFirst();

    expect(cartItem?.quantity).toEqual(2);
    expect(cartItem?.unit_price.toNumber()).toEqual(58.95);

    const response = await request(app.server)
      .patch(`/cart/${cartItem?.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 4,
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body.item).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        unit_price: 58.95,
        quantity: 4,
        product: expect.objectContaining({
          id: expect.any(String),
          title: "Product 1",
          description: "",
          category: "Product Category 1",
          price: 58.95,
          quantity: 5,
          is_active: true,
        }),
      }),
    );
  });
});
