import { PrismaCartsRepository } from "@/models/repositories/prisma/carts-repository.prisma.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { CreateCartService } from "../create-cart.service.js";

export function makeCreateCartService() {
  const cartsRepository = new PrismaCartsRepository();
  const usersRepository = new PrismaUsersRepository();
  const service = new CreateCartService(cartsRepository, usersRepository);

  return service;
}
