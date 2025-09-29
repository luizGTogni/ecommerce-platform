import { PrismaProductsRepository } from "@/models/repositories/prisma/products-repository.prisma.js";
import { EditProductService } from "../edit-product.service.js";

export function makeEditProductService() {
  const productsRepository = new PrismaProductsRepository();
  const service = new EditProductService(productsRepository);

  return service;
}
