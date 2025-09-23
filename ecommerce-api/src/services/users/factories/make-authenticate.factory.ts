import { BcryptHasherDriver } from "@/drivers/hasher/bcrypt.hasher.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { AuthenticateService } from "../authenticate.service.js";

export function makeAuthenticateFactory() {
  const usersRepository = new PrismaUsersRepository();
  const hasherDriver = new BcryptHasherDriver();
  const useCase = new AuthenticateService(usersRepository, hasherDriver);

  return useCase;
}
