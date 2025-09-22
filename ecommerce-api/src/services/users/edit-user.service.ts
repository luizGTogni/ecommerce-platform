import { ResourceAlreadyExistsError } from "@/errors/resource-already-exists.error.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { User } from "@/models/entities/user.entity.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";

type EditUserRequest = {
  userId: string;
  name: string;
  email: string;
};

type EditUserResponse = {
  user: User;
};

export class EditUserService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({
    userId,
    name,
    email,
  }: EditUserRequest): Promise<EditUserResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    const emailAlreadyExists = await this.usersRepository.findByEmail(email);

    if (emailAlreadyExists) {
      throw new ResourceAlreadyExistsError();
    }

    user.name = name;
    user.email = email;

    await this.usersRepository.save(user);

    return { user };
  }
}
