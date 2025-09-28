import { app } from "@/http/app.js";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user.js";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Edit User (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to edit a user", async () => {
    const { token, user } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .put("/users")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Christian Jones",
        email: "cristianjones@example.com",
      });

    expect(response.statusCode).toEqual(200);

    expect(user).toEqual(
      expect.objectContaining({
        name: "John Doe",
        email: "johndoe@example.com",
      }),
    );

    expect(response.body.user).toEqual(
      expect.objectContaining({
        name: "Christian Jones",
        email: "cristianjones@example.com",
      }),
    );
  });
});
