import { PrismaProductsRepository } from "@/models/repositories/prisma/products-repository.prisma.js";
import { GetProductService } from "../get-product.service.js";

export function makeGetProductService() {
  const productsRepository = new PrismaProductsRepository();
  const service = new GetProductService(productsRepository);

  return service;
}
