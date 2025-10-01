import { prisma } from "@/configs/prisma.js";
import { app } from "@/http/app.js";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user.js";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Remove Product to Cart (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to remove a product to cart", async () => {
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
      .post(`/carts/items`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 2,
        productId: product.id,
      });

    const cartItem = await prisma.cartItem.findFirst();

    const response = await request(app.server)
      .delete(`/carts/items/${cartItem?.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    const cartItemFounded = await prisma.cartItem.findFirst();

    expect(response.statusCode).toEqual(204);
    expect(cartItemFounded).toEqual(null);
  });
});
