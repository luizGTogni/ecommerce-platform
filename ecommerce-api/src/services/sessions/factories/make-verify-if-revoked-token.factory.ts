import { redis } from "@/http/app.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { RedisMemcacheRepository } from "@/models/repositories/redis/memcache-repository.redis.js";
import { VerifyIfRevokedTokenService } from "../verify-if-revoked-token.service.js";

export function makeVerifyIfRevokedTokenService() {
  const usersRepository = new PrismaUsersRepository();
  const memcacheRepository = new RedisMemcacheRepository(redis);
  const useCase = new VerifyIfRevokedTokenService(
    usersRepository,
    memcacheRepository,
  );

  return useCase;
}
