import { IHasher } from "@/drivers/interfaces/hasher.interface.js";
import { InvalidCredentialsError } from "@/errors/invalid-credentials.error.js";
import { User } from "@/models/entities/user.entity.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";

type AuthenticateRequest = {
  email: string;
  password: string;
};

type AuthenticateResponse = {
  user: User;
};

export class AuthenticateService {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly hasherDriver: IHasher,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateRequest): Promise<AuthenticateResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doPasswordsMatch = await this.hasherDriver.compare({
      plain: password,
      hashed: user.password_hash,
    });

    if (!doPasswordsMatch) {
      throw new InvalidCredentialsError();
    }

    return { user };
  }
}
