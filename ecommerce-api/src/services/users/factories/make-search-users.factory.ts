import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { SearchUsersService } from "../search-users.service.js";

export function makeSearchUsersService() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new SearchUsersService(usersRepository);

  return useCase;
}
