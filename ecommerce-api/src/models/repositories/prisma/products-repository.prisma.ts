import { prisma } from "@/configs/prisma.js";
import { Prisma } from "@/generated/prisma/index.js";
import { ProductCreate } from "@/models/entities/dto/product-create.dto.js";
import { Product } from "@/models/entities/product.entity.js";
import { IProductsRepository } from "../interfaces/products-repository.interface.js";

export class PrismaProductsRepository implements IProductsRepository {
  private NUMBERS_BY_PAGE = 20;

  async create(data: ProductCreate) {
    return await prisma.product.create({
      data: {
        ...data,
        price: Prisma.Decimal(data.price),
      },
    });
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
    return await prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  async searchMany(query: string, includeInactive: boolean, page: number) {
    const initialPage = (page - 1) * this.NUMBERS_BY_PAGE;
    const untilPage = page * this.NUMBERS_BY_PAGE;

    if (includeInactive) {
      const products = await prisma.product.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
              },
            },
            {
              description: {
                contains: query,
              },
            },
            {
              category: {
                contains: query,
              },
            },
          ],
        },
        skip: initialPage,
        take: untilPage,
      });

      return products;
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            description: {
              contains: query,
            },
          },
          {
            category: {
              contains: query,
            },
          },
        ],
        AND: [
          {
            is_active: true,
          },
        ],
      },
      skip: initialPage,
      take: untilPage,
    });

    return products;
  }
}
