import { PrismaSessionsRepository } from "@/models/repositories/prisma/sessions-repository.prisma.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { DeleteUserService } from "../delete-user.service.js";

export function makeDeleteUserService() {
  const usersRepository = new PrismaUsersRepository();
  const sessionsRepository = new PrismaSessionsRepository();
  const useCase = new DeleteUserService(usersRepository, sessionsRepository);

  return useCase;
}
