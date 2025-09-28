import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import type { IMemcacheRepository } from "@/models/repositories/interfaces/memcache-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";

type VerifyIfRevokedTokenRequest = {
  userId: string;
  token: string;
};

type VerifyIfRevokedTokenResponse = {
  isRevoked: boolean;
};

export class VerifyIfRevokedTokenService {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly memcacheRepository: IMemcacheRepository,
  ) {}

  async execute({
    userId,
    token,
  }: VerifyIfRevokedTokenRequest): Promise<VerifyIfRevokedTokenResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    const tokenRevoked = await this.memcacheRepository.get(
      `revoked_list_${userId}`,
    );

    if (!tokenRevoked) {
      return { isRevoked: false };
    }

    return { isRevoked: tokenRevoked === token };
  }
}
