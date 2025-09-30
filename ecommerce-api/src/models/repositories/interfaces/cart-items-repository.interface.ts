import { CartItem } from "@/models/entities/cart-item.entity.js";
import { CartItemCreate } from "@/models/entities/dto/cart-item-create.dto.js";
import { CartItemEdited } from "@/models/entities/dto/cart-item-edited.dto.js";

export type FindByCartIdAndProductIdProps = {
  cartId: string;
  productId: string;
};

export interface ICartItemsRepository {
  create(data: CartItemCreate): Promise<CartItem>;
  save(cartItemId: string, cartItem: CartItemEdited): Promise<void>;
  findByCartIdAndProductId(
    props: FindByCartIdAndProductIdProps,
  ): Promise<CartItem | null>;
}
