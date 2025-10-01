import { prisma } from "@/configs/prisma.js";
import { CartItemCreate } from "@/models/entities/dto/cart-item-create.dto.js";
import { CartItemEdited } from "@/models/entities/dto/cart-item-edited.dto.js";
import {
  FindByCartIdAndProductIdProps,
  ICartItemsRepository,
} from "../interfaces/cart-items-repository.interface.js";

export class PrismaCartItemsRepository implements ICartItemsRepository {
  async create(data: CartItemCreate) {
    return await prisma.cartItem.create({
      data,
    });
  }

  async save(cartItemId: string, cartItem: CartItemEdited) {
    await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: cartItem,
    });
  }

  async findById(id: string) {
    return await prisma.cartItem.findUnique({
      where: {
        id,
      },
      include: {
        product: true,
      },
    });
  }

  async findByCartIdAndProductId({
    cartId,
    productId,
  }: FindByCartIdAndProductIdProps) {
    return await prisma.cartItem.findFirst({
      where: {
        cart_id: cartId,
        product_id: productId,
      },
    });
  }

  async delete(id: string) {
    await prisma.cartItem.delete({
      where: {
        id,
      },
    });
  }
}
