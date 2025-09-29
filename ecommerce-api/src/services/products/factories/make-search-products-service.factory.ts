import { PrismaProductsRepository } from "@/models/repositories/prisma/products-repository.prisma.js";
import { SearchProductsService } from "../search-products.service.js";

export function makeSearchProductsService() {
  const productsRepository = new PrismaProductsRepository();
  const service = new SearchProductsService(productsRepository);

  return service;
}
