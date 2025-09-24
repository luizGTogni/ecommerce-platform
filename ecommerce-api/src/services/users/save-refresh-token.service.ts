import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { User } from "@/models/entities/user.entity.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";

type SaveRefreshTokenRequest = {
  userId: string;
  refreshToken: string;
};

type SaveRefreshTokenResponse = {
  user: User;
};

export class SaveRefreshTokenService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({
    userId,
    refreshToken,
  }: SaveRefreshTokenRequest): Promise<SaveRefreshTokenResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    user.session_hash = refreshToken;

    await this.usersRepository.save(user);

    return { user };
  }
}
