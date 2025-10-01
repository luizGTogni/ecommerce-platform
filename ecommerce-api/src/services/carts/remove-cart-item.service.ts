import { CartAlreadyFinishedError } from "@/errors/cart-already-finished.error.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import type { ICartItemsRepository } from "@/models/repositories/interfaces/cart-items-repository.interface.js";
import type { ICartsRepository } from "@/models/repositories/interfaces/carts-repository.interface.js";
import type { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";

type RemoveCartItemRequest = {
  userId: string;
  cartItemId: string;
};

export class RemoveCartItemService {
  constructor(
    private readonly cartItemsRepository: ICartItemsRepository,
    private readonly cartsRepository: ICartsRepository,
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({ userId, cartItemId }: RemoveCartItemRequest): Promise<void> {
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

    await this.cartItemsRepository.delete(cartItemId);
  }
}
