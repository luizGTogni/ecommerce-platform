import { prisma } from "@/configs/prisma.js";
import { app } from "@/http/app.js";
import request from "supertest";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Search Products (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search products", async () => {
    const { token } = await createAndAuthenticateUser(app);

    await prisma.product.create({
      data: {
        title: "Product 1",
        description: "",
        category: "Product Category 1",
        price: 58.95,
        quantity: 2,
        is_active: true,
      },
    });

    await prisma.product.create({
      data: {
        title: "Product 2",
        description: "",
        category: "Product Category 2",
        price: 58.95,
        quantity: 2,
        is_active: false,
      },
    });

    const response = await request(app.server)
      .get("/products")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.products).toHaveLength(1);
    expect(response.body.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Product 1",
        }),
      ]),
    );
  });
});
