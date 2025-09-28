import { prisma } from "@/configs/prisma.js";
import { app } from "@/http/app.js";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user.js";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Delete User (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to delete a user", async () => {
    const { token, user } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .delete("/users")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(204);

    const userFounded = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    expect(userFounded).toBe(null);
  });
});
