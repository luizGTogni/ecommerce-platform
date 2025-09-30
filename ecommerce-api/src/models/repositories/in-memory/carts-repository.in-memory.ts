import { Cart } from "@/models/entities/cart.entity.js";
import {
  FindByUserIdAndStatusProps,
  ICartsRepository,
} from "../interfaces/carts-repository.interface.js";
import { CartCreate } from "@/models/entities/dto/cart-create.dto.js";
import { randomUUID } from "node:crypto";
import { CartEdited } from "@/models/entities/dto/cart-edited.dto.js";

export class InMemoryCartsRepository implements ICartsRepository {
  private carts: Cart[] = [];

  async create({ user_id, status }: CartCreate) {
    const cart: Cart = {
      id: randomUUID(),
      user_id,
      status,
      finished_at: null,
      created_at: new Date(),
    };

    this.carts.push(cart);

    return cart;
  }

  async save(cartId: string, cartEdited: CartEdited) {
    const cartIndex = this.carts.findIndex((cart) => cart.id === cartId);
    this.carts[cartIndex] = cartEdited;
  }

  async findById(id: string) {
    return this.carts.find((cart) => cart.id === id) || null;
  }

  async findByUserIdAndStatus({ userId, status }: FindByUserIdAndStatusProps) {
    return (
      this.carts.find(
        (cart) => cart.user_id === userId && cart.status === status,
      ) || null
    );
  }
}
