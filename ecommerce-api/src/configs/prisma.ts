import { PrismaClient } from "../generated/prisma/index.js";
import { env } from "./env.js";

export const prisma = new PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : [],
});
