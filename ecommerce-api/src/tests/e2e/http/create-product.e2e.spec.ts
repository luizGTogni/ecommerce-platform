import { app } from "@/http/app.js";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user.js";
import request from "supertest";
import { describe, afterAll, beforeAll, it, expect } from "vitest";

describe("Create Product (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a product", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Product 1",
        description: "",
        category: "Product Category 1",
        price: 58.95,
        quantity: 2,
        is_active: true,
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.product).toEqual({
      id: expect.any(String),
      title: "Product 1",
      description: "",
      category: "Product Category 1",
      price: 58.95,
      quantity: 2,
      is_active: true,
    });
  });
});
