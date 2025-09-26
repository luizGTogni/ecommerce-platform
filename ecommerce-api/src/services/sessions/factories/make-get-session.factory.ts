import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { PrismaSessionsRepository } from "@/models/repositories/prisma/sessions-repository.prisma.js";
import { BcryptHasherDriver } from "@/drivers/hasher/bcrypt.hasher.js";
import { GetSessionService } from "../get-session.service.js";

export function makeGetSessionService() {
  const usersRepository = new PrismaUsersRepository();
  const sessionsRepository = new PrismaSessionsRepository();
  const hasherDriver = new BcryptHasherDriver();
  const useCase = new GetSessionService(
    usersRepository,
    sessionsRepository,
    hasherDriver,
  );

  return useCase;
}
