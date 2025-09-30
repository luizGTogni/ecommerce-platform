import { CartCreate } from "@/models/entities/dto/cart-create.dto.js";
import {
  FindByUserIdAndStatusProps,
  ICartsRepository,
} from "../interfaces/carts-repository.interface.js";
import { prisma } from "@/configs/prisma.js";
import { CartEdited } from "@/models/entities/dto/cart-edited.dto.js";

export class PrismaCartsRepository implements ICartsRepository {
  async create({ user_id, status }: CartCreate) {
    return await prisma.cart.create({
      data: {
        user_id,
        status,
      },
    });
  }

  async save(cartId: string, cartEdited: CartEdited) {
    await prisma.cart.update({
      where: {
        id: cartId,
      },
      data: cartEdited,
    });
  }

  async findById(id: string) {
    return prisma.cart.findUnique({
      where: {
        id,
      },
      include: {
        cart_items: {
          select: {
            id: true,
            quantity: true,
            unit_price: true,
            product: {
              select: {
                id: true,
                category: true,
                title: true,
                price: true,
                quantity: true,
              },
            },
          },
        },
      },
    });
  }

  async findByUserIdAndStatus({ userId, status }: FindByUserIdAndStatusProps) {
    return prisma.cart.findFirst({
      where: {
        user_id: userId,
        status,
      },
    });
  }
}
