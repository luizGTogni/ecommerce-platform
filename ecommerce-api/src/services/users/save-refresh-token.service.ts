import type { IHasher } from "@/drivers/interfaces/hasher.interface.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import type { Session } from "@/models/entities/session.entity.js";
import type { ISessionsRepository } from "@/models/repositories/interfaces/sessions-repository.interface.js";
import type { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";

type SaveRefreshTokenRequest = {
  userId: string;
  refreshToken: string;
  expiresAt: Date;
};

type SaveRefreshTokenResponse = {
  session: Session;
};

export class SaveRefreshTokenService {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly sessionsRepository: ISessionsRepository,
    private readonly hasherDriver: IHasher,
  ) {}

  async execute({
    userId,
    refreshToken,
    expiresAt,
  }: SaveRefreshTokenRequest): Promise<SaveRefreshTokenResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    const session_current =
      await this.sessionsRepository.findByUserIdAndRevoked({
        userId,
        isRevoked: false,
      });

    if (session_current) {
      session_current.revoked = true;
      await this.sessionsRepository.save(session_current);
    }

    const session = await this.sessionsRepository.create({
      user_id: userId,
      token_hash: await this.hasherDriver.hash({
        plain: refreshToken,
        salt: 8,
      }),
      expires_at: expiresAt,
    });

    return { session };
  }
}
