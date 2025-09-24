import { app } from "@/http/app.js";
import request from "supertest";
import { describe, afterAll, beforeAll, it, expect } from "vitest";

describe("Create User (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a user", async () => {
    const response = await request(app.server).post("/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(201);
    expect(response.body.user).toEqual({
      id: expect.any(String),
      name: "John Doe",
      email: "johndoe@example.com",
      created_at: expect.any(String),
    });
    expect(new Date(response.body.user.created_at).toString()).not.toBe(
      "Invalid Date",
    );
  });
});
