import { prisma } from "@/configs/prisma.js";
import { app } from "@/http/app.js";
import { createAndAuthenticateUser } from "@/utils/tests/create-and-authenticate-user.js";
import request from "supertest";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

describe("Get User Profile (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(async () => {
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
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

  it("should be able to get a user profile + refresh token", async () => {
    vi.useFakeTimers();
    vi.setSystemTime("2025-09-25T10:00:00Z");
    const { token, user, cookies } = await createAndAuthenticateUser(app);

    vi.setSystemTime("2025-09-26T10:00:01Z");

    const responseProfile = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(responseProfile.statusCode).toEqual(401);

    const responseRefresh = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies)
      .send();

    const response = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${responseRefresh.body.token}`)
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

    vi.useRealTimers();
  });
});
