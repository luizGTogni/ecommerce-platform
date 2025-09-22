import { IHasher } from "@/drivers/interfaces/hasher.interface.js";
import { ResourceAlreadyExistsError } from "@/errors/resource-already-exists.error.js";
import { User } from "@/models/entities/user.entity.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";

type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
};

type CreateUserResponse = {
  user: User;
};

export class CreateUserService {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly hasherDriver: IHasher,
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserRequest): Promise<CreateUserResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new ResourceAlreadyExistsError();
    }

    const passwordHashed = await this.hasherDriver.hash({ plain: password });

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHashed,
    });

    return { user };
  }
}
