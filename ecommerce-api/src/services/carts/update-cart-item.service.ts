import { CartAlreadyFinishedError } from "@/errors/cart-already-finished.error.js";
import { ProductOutOfStockError } from "@/errors/product-out-of-stock.error.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import type { CartItemRead } from "@/models/entities/dto/cart-item-read.dto.js";
import type { ICartItemsRepository } from "@/models/repositories/interfaces/cart-items-repository.interface.js";
import type { ICartsRepository } from "@/models/repositories/interfaces/carts-repository.interface.js";
import type { IProductsRepository } from "@/models/repositories/interfaces/products-repository.interface.js";
import type { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";

type UpdateCartItemRequest = {
  userId: string;
  cartItemId: string;
  quantity: number;
};

type UpdateCartItemResponse = {
  cartItem: CartItemRead;
};

export class UpdateCartItemService {
  constructor(
    private readonly cartItemsRepository: ICartItemsRepository,
    private readonly cartsRepository: ICartsRepository,
    private readonly productsRepository: IProductsRepository,
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({
    userId,
    cartItemId,
    quantity,
  }: UpdateCartItemRequest): Promise<UpdateCartItemResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    const cartItem = await this.cartItemsRepository.findById(cartItemId);

    if (!cartItem) {
      throw new ResourceNotFoundError();
    }

    const cart = await this.cartsRepository.findById(cartItem.cart_id);

    if (!cart) {
      throw new ResourceNotFoundError();
    }

    if (cart.user_id !== userId) {
      throw new ResourceNotFoundError();
    }

    if (cart.status === "CANCELED" || cart.status === "COMPLETED") {
      throw new CartAlreadyFinishedError(cart.status);
    }

    const product = await this.productsRepository.findById(cartItem.product_id);

    if (!product) {
      throw new ResourceNotFoundError();
    }

    if (quantity > product.quantity || !product.is_active) {
      throw new ProductOutOfStockError();
    }

    cartItem.quantity = quantity;
    cartItem.unit_price = product.price;

    await this.cartItemsRepository.save(cartItemId, {
      id: cartItem.id,
      cart_id: cartItem.cart_id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
      unit_price: cartItem.unit_price,
    });

    return {
      cartItem: {
        ...cartItem,
        unit_price: cartItem.unit_price.toNumber(),
      },
    };
  }
}
