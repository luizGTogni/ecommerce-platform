import { prisma } from "@/configs/prisma.js";
import { ProductCreate } from "@/models/entities/dto/product-create.dto.js";
import { IProductsRepository } from "../interfaces/products-repository.interface.js";
import { Prisma } from "@/generated/prisma/index.js";
import { Product } from "@/models/entities/product.entity.js";

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

  async save(productId: string, productData: Product) {
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        ...productData,
        price: Prisma.Decimal(productData.price),
      },
    });
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return null;
    }

    return {
      ...product,
      price: product.price.toNumber(),
    };
  }
}
