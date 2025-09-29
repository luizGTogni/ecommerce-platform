import { prisma } from "@/configs/prisma.js";
import { ProductCreate } from "@/models/entities/dto/product-create.dto.js";
import { IProductsRepository } from "../interfaces/products-repository.interface.js";
import { Prisma } from "@/generated/prisma/index.js";

export class PrismaProductsRepository implements IProductsRepository {
  async create(data: ProductCreate) {
    const product = await prisma.product.create({
      data: {
        ...data,
        price: Prisma.Decimal(data.price),
      },
    });

    return {
      ...product,
      price: data.price,
    };
  }
}
