import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { GetUserProfileService } from "../get-user-profile.service.js";

export function makeGetUserProfileService() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new GetUserProfileService(usersRepository);

  return useCase;
}
