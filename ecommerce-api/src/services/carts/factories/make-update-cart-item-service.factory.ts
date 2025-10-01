import { PrismaCartItemsRepository } from "@/models/repositories/prisma/cart-items-repository.prisma.js";
import { PrismaCartsRepository } from "@/models/repositories/prisma/carts-repository.prisma.js";
import { PrismaProductsRepository } from "@/models/repositories/prisma/products-repository.prisma.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { UpdateCartItemService } from "../update-cart-item.service.js";

export function makeUpdateCartItemService() {
  const cartItemsRepository = new PrismaCartItemsRepository();
  const cartsRepository = new PrismaCartsRepository();
  const productsRepository = new PrismaProductsRepository();
  const usersRepository = new PrismaUsersRepository();
  const service = new UpdateCartItemService(
    cartItemsRepository,
    cartsRepository,
    productsRepository,
    usersRepository,
  );

  return service;
}
