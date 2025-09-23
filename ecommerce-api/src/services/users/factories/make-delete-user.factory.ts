import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { DeleteUserService } from "../delete-user.service.js";

export function makeDeleteUserService() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new DeleteUserService(usersRepository);

  return useCase;
}
