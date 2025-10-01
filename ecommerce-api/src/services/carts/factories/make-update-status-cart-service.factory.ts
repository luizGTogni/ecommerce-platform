import { PrismaCartsRepository } from "@/models/repositories/prisma/carts-repository.prisma.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { UpdateStatusCartService } from "../update-status-cart.service.js";

export function makeUpdateStatusCartService() {
  const cartsRepository = new PrismaCartsRepository();
  const usersRepository = new PrismaUsersRepository();
  const service = new UpdateStatusCartService(cartsRepository, usersRepository);

  return service;
}
