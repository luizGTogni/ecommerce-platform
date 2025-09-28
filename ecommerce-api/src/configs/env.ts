import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  REDIS_MODE: z.enum(["dev", "test"]).default("dev"),
  REDIS_PASSWORD: z.string(),
  REDIS_PORT: z.coerce.number(),
  JWT_SECRET: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.log("Invalid environment variables", z.treeifyError(_env.error));

  throw new Error("Invalid environment variables.");
}

export const env = _env.data;
