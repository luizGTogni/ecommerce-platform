import { BcryptHasherDriver } from "@/drivers/hasher/bcrypt.hasher.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { CreateUserService } from "../create.service.js";

export function makeCreateUserService() {
  const usersRepository = new PrismaUsersRepository();
  const hasherDriver = new BcryptHasherDriver();
  const useCase = new CreateUserService(usersRepository, hasherDriver);

  return useCase;
}
