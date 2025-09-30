import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { Cart } from "@/models/entities/cart.entity.js";
import { ICartsRepository } from "@/models/repositories/interfaces/carts-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";

type GetCartRequest = {
  userId: string;
  cartId: string;
};

type GetCartResponse = {
  cart: Cart;
  total_products: number;
  total_price: number;
};

export class GetCartService {
  constructor(
    private readonly cartsRepository: ICartsRepository,
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({ userId, cartId }: GetCartRequest): Promise<GetCartResponse> {
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

    const total_products = cart.cart_items ? cart.cart_items.length : 0;

    const total_price = cart.cart_items
      ? cart.cart_items.reduce(
          (acc, item) => acc + item.unit_price.toNumber() * item.quantity,
          0,
        )
      : 0;

    return { cart, total_products, total_price };
  }
}
