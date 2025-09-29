import { app } from "@/http/app.js";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user.js";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Edit Product (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to edit a product", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const responseCreated = await request(app.server)
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

    const product = responseCreated.body.product;

    const response = await request(app.server)
      .put(`/products/${product.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Product 2",
        description: "Product Description 2",
        category: "Product Category 2",
        price: 108.95,
        quantity: 20,
        is_active: false,
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body.product).toEqual(
      expect.objectContaining({
        title: "Product 2",
        description: "Product Description 2",
        category: "Product Category 2",
        price: 108.95,
        quantity: 20,
        is_active: false,
      }),
    );
  });
});
