import { PrismaCartItemsRepository } from "@/models/repositories/prisma/cart-items-repository.prisma.js";
import { PrismaCartsRepository } from "@/models/repositories/prisma/carts-repository.prisma.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { RemoveCartItemService } from "../remove-cart-item.service.js";

export function makeRemoveCartItemService() {
  const cartItemsRepository = new PrismaCartItemsRepository();
  const cartsRepository = new PrismaCartsRepository();
  const usersRepository = new PrismaUsersRepository();
  const service = new RemoveCartItemService(
    cartItemsRepository,
    cartsRepository,
    usersRepository,
  );

  return service;
}
