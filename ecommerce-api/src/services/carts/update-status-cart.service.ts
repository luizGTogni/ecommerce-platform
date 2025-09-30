import { CartAlreadyFinishedError } from "@/errors/cart-already-finished.error.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { CartStatus } from "@/models/entities/cart.entity.js";
import type { CartRead } from "@/models/entities/dto/cart-read.dto.js";
import { ICartsRepository } from "@/models/repositories/interfaces/carts-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";

type UpdateStatusCartRequest = {
  userId: string;
  cartId: string;
  newStatus: CartStatus;
};

type UpdateStatusCartResponse = {
  cart: CartRead;
};

export class UpdateStatusCartService {
  constructor(
    private readonly cartsRepository: ICartsRepository,
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({
    userId,
    cartId,
    newStatus,
  }: UpdateStatusCartRequest): Promise<UpdateStatusCartResponse> {
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
    cart.status = newStatus;

    await this.cartsRepository.save(cartId, {
      id: cart.id,
      user_id: cart.user_id,
      status: cart.status,
      finished_at: cart.finished_at,
      created_at: cart.created_at,
    });

    const cartItemsFormatted = cart.cart_items?.map((item) => {
      return {
        ...item,
        unit_price: item.unit_price.toNumber(),
        product: {
          ...item.product,
          price: item.product.price.toNumber(),
        },
      };
    });

    return {
      cart: {
        ...cart,
        cart_items: cartItemsFormatted,
      },
    };
  }
}
