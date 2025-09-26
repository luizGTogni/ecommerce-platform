import { app } from "@/http/app.js";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user.js";
import request from "supertest";
import { describe, afterAll, beforeAll, it, expect } from "vitest";

describe("Get User Profile (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get a user profile", async () => {
    const { token, user } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.user).toEqual({
      id: user.id,
      name: "John Doe",
      email: "johndoe@example.com",
      created_at: expect.any(String),
    });
    expect(new Date(response.body.user.created_at).toString()).not.toBe(
      "Invalid Date",
    );
  });
});
