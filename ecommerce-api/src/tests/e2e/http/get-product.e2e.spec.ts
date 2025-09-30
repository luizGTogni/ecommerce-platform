import { prisma } from "@/configs/prisma.js";
import { app } from "@/http/app.js";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user.js";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Get Product (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get a product info", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const productCreated = await prisma.product.create({
      data: {
        title: "Product 1",
        description: "",
        category: "Product Category 1",
        price: 58.95,
        quantity: 2,
        is_active: true,
      },
    });

    const response = await request(app.server)
      .get(`/products/${productCreated.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.product).toEqual({
      id: productCreated.id,
      title: "Product 1",
      description: "",
      category: "Product Category 1",
      price: 58.95,
      quantity: 2,
      is_active: true,
    });
  });
});
