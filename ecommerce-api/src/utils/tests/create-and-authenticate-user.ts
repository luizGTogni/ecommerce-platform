import { prisma } from "@/configs/prisma.js";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    },
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email: "johndoe@example.com",
    password: "123456",
  });

  const { token } = authResponse.body;

  const cookies = authResponse.get("Set-Cookie") || [];

  return { token, user, cookies };
}
