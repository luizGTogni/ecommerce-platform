import { PrismaCartsRepository } from "@/models/repositories/prisma/carts-repository.prisma.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { GetCartService } from "../get-cart.service.js";

export function makeGetCartService() {
  const cartsRepository = new PrismaCartsRepository();
  const usersRepository = new PrismaUsersRepository();
  const service = new GetCartService(cartsRepository, usersRepository);

  return service;
}
