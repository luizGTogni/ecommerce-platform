import { app } from "@/http/app.js";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user.js";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Logout (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to logout", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const response = await request(app.server)
      .post("/logout")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(204);
    expect(response.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
