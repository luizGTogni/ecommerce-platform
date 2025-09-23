import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { EditUserService } from "../edit-user.service.js";

export function makeEditUserService() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new EditUserService(usersRepository);

  return useCase;
}
