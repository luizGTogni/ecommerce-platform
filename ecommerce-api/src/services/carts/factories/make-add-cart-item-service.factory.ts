import { PrismaCartItemsRepository } from "@/models/repositories/prisma/cart-items-repository.prisma.js";
import { PrismaCartsRepository } from "@/models/repositories/prisma/carts-repository.prisma.js";
import { PrismaProductsRepository } from "@/models/repositories/prisma/products-repository.prisma.js";
import { PrismaUsersRepository } from "@/models/repositories/prisma/users-repository.prisma.js";
import { AddCartItemService } from "../add-cart-item.service.js";

export function makeAddCartItemService() {
  const cartItemsRepository = new PrismaCartItemsRepository();
  const productsRepository = new PrismaProductsRepository();
  const cartsRepository = new PrismaCartsRepository();
  const usersRepository = new PrismaUsersRepository();
  const service = new AddCartItemService(
    cartItemsRepository,
    productsRepository,
    cartsRepository,
    usersRepository,
  );

  return service;
}
