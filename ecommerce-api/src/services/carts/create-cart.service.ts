import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { CartStatus } from "@/models/entities/cart.entity.js";
import type { CartRead } from "@/models/entities/dto/cart-read.dto.js";
import { ICartsRepository } from "@/models/repositories/interfaces/carts-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";

type CreateCartRequest = {
  userId: string;
  status?: CartStatus;
};

type CreateCartResponse = {
  cart: CartRead;
};

export class CreateCartService {
  constructor(
    private readonly cartsRepository: ICartsRepository,
    private readonly usersRepository: IUsersRepository,
  ) {}

  async execute({
    userId,
    status,
  }: CreateCartRequest): Promise<CreateCartResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    const cartAlreadyExists = await this.cartsRepository.findByUserIdAndStatus({
      userId,
      status: "OPEN",
    });

    if (cartAlreadyExists) {
      const cartItemsFormatted = cartAlreadyExists.cart_items?.map((item) => {
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
          ...cartAlreadyExists,
          cart_items: cartItemsFormatted,
        },
      };
    }

    const cart = await this.cartsRepository.create({
      user_id: userId,
      status: status ? status : "OPEN",
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
