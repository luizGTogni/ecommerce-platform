import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { SaveRefreshTokenService } from "../save-refresh-token.service.js";
import { PrismaSessionsRepository } from "@/models/repositories/prisma/sessions-repository.prisma.js";
import { BcryptHasherDriver } from "@/drivers/hasher/bcrypt.hasher.js";

export function makeSaveRefreshTokenService() {
  const usersRepository = new PrismaUsersRepository();
  const sessionsRepository = new PrismaSessionsRepository();
  const hasherDriver = new BcryptHasherDriver();
  const useCase = new SaveRefreshTokenService(
    usersRepository,
    sessionsRepository,
    hasherDriver,
  );

  return useCase;
}
