import { CartAlreadyFinishedError } from "@/errors/cart-already-finished.error.js";
import { ProductOutOfStockError } from "@/errors/product-out-of-stock.error.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { CartItem } from "@/models/entities/cart-item.entity.js";
import { ICartItemsRepository } from "@/models/repositories/interfaces/cart-items-repository.interface.js";
import { ICartsRepository } from "@/models/repositories/interfaces/carts-repository.interface.js";
import { IProductsRepository } from "@/models/repositories/interfaces/products-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import { Decimal } from "@prisma/client/runtime/library";

type AddCartItemRequest = {
  userId: string;
  productId: string;
  cartId: string;
  quantity: number;
};

type AddCartItemResponse = {
  cartItem: CartItem;
};

export class AddCartItemService {
  constructor(
    private readonly cartItemsRepository: ICartItemsRepository,
    private readonly productsRepository: IProductsRepository,
    private readonly cartsRepository: ICartsRepository,
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({
    userId,
    productId,
    cartId,
    quantity,
  }: AddCartItemRequest): Promise<AddCartItemResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    const cart = await this.cartsRepository.findById(cartId);

    if (!cart) {
      throw new ResourceNotFoundError();
    }

    if (cart.user_id !== userId) {
      throw new ResourceNotFoundError();
    }

    if (cart.status === "CANCELED" || cart.status === "COMPLETED") {
      throw new CartAlreadyFinishedError(cart.status);
    }

    const product = await this.productsRepository.findById(productId);

    if (!product) {
      throw new ResourceNotFoundError();
    }

    if (quantity > product.quantity || !product.is_active) {
      throw new ProductOutOfStockError();
    }

    let cartItem = await this.cartItemsRepository.findByCartIdAndProductId({
      cartId,
      productId,
    });

    if (cartItem) {
      cartItem.quantity = quantity;
      cartItem.unit_price = new Decimal(product.price);

      await this.cartItemsRepository.save(cartItem.id, cartItem);

      return { cartItem };
    }

    cartItem = await this.cartItemsRepository.create({
      cart_id: cartId,
      product_id: productId,
      quantity,
      unit_price: new Decimal(product.price),
    });

    return { cartItem };
  }
}
