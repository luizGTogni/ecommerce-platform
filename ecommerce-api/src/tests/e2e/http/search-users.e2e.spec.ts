import { prisma } from "@/configs/prisma.js";
import { app } from "@/http/app.js";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user.js";
import { hash } from "bcryptjs";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Search Users (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search users", async () => {
    const { token } = await createAndAuthenticateUser(app);

    await prisma.user.create({
      data: {
        name: "Michael Doe",
        email: "michaeldoe@example.com",
        password_hash: await hash("123456", 6),
      },
    });

    const response = await request(app.server)
      .get("/users")
      .set("Authorization", `Bearer ${token}`)
      .send();

    console.log(response.body);

    expect(response.statusCode).toEqual(200);
    expect(response.body.users).toHaveLength(2);
    expect(response.body.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "John Doe",
          email: "johndoe@example.com",
        }),
        expect.objectContaining({
          name: "Michael Doe",
          email: "michaeldoe@example.com",
        }),
      ]),
    );
  });
});
