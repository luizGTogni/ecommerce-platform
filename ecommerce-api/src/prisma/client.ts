import { PrismaClient } from "@prisma/client/extension";
import { env } from "../configs/env.js";

export const prisma = PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : [],
});
