import { Cart, CartStatus } from "@/models/entities/cart.entity.js";
import { CartCreate } from "@/models/entities/dto/cart-create.dto.js";
import { CartEdited } from "@/models/entities/dto/cart-edited.dto.js";

export type FindByUserIdAndStatusProps = {
  userId: string;
  status: CartStatus;
};

export interface ICartsRepository {
  create(data: CartCreate): Promise<Cart>;
  save(cartId: string, cartEdited: CartEdited): Promise<void>;
  findById(id: string): Promise<Cart | null>;
  findByUserIdAndStatus(
    props: FindByUserIdAndStatusProps,
  ): Promise<Cart | null>;
}
