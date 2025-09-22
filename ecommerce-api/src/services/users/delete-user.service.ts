import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";

type DeleteUserRequest = {
  userId: string;
};

export class DeleteUserService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({ userId }: DeleteUserRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    await this.usersRepository.delete(userId);
  }
}
