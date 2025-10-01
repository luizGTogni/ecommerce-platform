import { prisma } from "@/configs/prisma.js";
import { app } from "@/http/app.js";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user.js";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Update Cart Status (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to update the cart statys", async () => {
    const { token, user } = await createAndAuthenticateUser(app);

    const product = await prisma.cart.create({
      data: {
        user_id: user.id,
        status: "OPEN",
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

    const response = await request(app.server)
      .patch(`/carts/${cart?.id}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        newStatus: "COMPLETED",
      });

    expect(response.statusCode).toEqual(204);

    const cartUpdated = await prisma.cart.findFirst();

    expect(cartUpdated?.status).toEqual("COMPLETED");
  });
});
