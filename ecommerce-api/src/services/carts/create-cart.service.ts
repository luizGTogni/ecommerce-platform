import { ResourceAlreadyExistsError } from "@/errors/resource-already-exists.error.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { Cart, CartStatus } from "@/models/entities/cart.entity.js";
import { ICartsRepository } from "@/models/repositories/interfaces/carts-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";

type CreateCartRequest = {
  userId: string;
  status?: CartStatus;
};

type CreateCartResponse = {
  cart: Cart;
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
      throw new ResourceAlreadyExistsError();
    }

    const cart = await this.cartsRepository.create({
      user_id: userId,
      status: status ? status : "OPEN",
    });

    return { cart };
  }
}
