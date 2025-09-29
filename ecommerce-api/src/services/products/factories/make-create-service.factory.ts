import { PrismaProductsRepository } from "@/models/repositories/prisma/products-repository.prisma.js";
import { CreateProductService } from "../create.service.js";

export function makeCreateProductService() {
  const productsRepository = new PrismaProductsRepository();
  const service = new CreateProductService(productsRepository);

  return service;
}
