import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { SaveRefreshTokenService } from "../save-refresh-token.service.js";

export function makeSaveRefreshTokenService() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new SaveRefreshTokenService(usersRepository);

  return useCase;
}
