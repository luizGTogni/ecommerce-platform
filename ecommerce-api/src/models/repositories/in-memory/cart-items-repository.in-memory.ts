import { CartItem } from "@/models/entities/cart-item.entity.js";
import {
  FindByCartIdAndProductIdProps,
  ICartItemsRepository,
} from "../interfaces/cart-items-repository.interface.js";
import { CartItemCreate } from "@/models/entities/dto/cart-item-create.dto.js";
import { randomUUID } from "crypto";
import { CartItemEdited } from "@/models/entities/dto/cart-item-edited.dto.js";
import { Decimal } from "@prisma/client/runtime/library";

export class InMemoryCartItemsRepository implements ICartItemsRepository {
  private cartItems: CartItem[] = [];

  async create({ cart_id, product_id, quantity, unit_price }: CartItemCreate) {
    const cartItem: CartItem = {
      id: randomUUID(),
      cart_id,
      product_id,
      quantity,
      unit_price: new Decimal(unit_price),
    };

    this.cartItems.push(cartItem);

    return cartItem;
  }

  async save(cartItemId: string, cartItem: CartItemEdited) {
    const cartItemIndex = this.cartItems.findIndex(
      (cartItem) => cartItem.id === cartItemId,
    );
    this.cartItems[cartItemIndex] = cartItem;
  }

  async findByCartIdAndProductId({
    cartId,
    productId,
  }: FindByCartIdAndProductIdProps) {
    return (
      this.cartItems.find(
        (cartItem) =>
          cartItem.cart_id === cartId && cartItem.product_id === productId,
      ) || null
    );
  }
}
