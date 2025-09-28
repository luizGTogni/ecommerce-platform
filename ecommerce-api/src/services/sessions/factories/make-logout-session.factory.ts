import { redis } from "@/http/app.js";
import { PrismaSessionsRepository } from "@/models/repositories/prisma/sessions-repository.prisma.js";
import { RedisMemcacheRepository } from "@/models/repositories/redis/memcache-repository.redis.js";
import { LogoutSessionService } from "../logout-session.service.js";

export function makeLogoutSessionService() {
  const sessionsRepository = new PrismaSessionsRepository();
  const memcacheRepository = new RedisMemcacheRepository(redis);
  const useCase = new LogoutSessionService(
    sessionsRepository,
    memcacheRepository,
  );

  return useCase;
}
