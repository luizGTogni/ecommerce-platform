import { IHasher } from "@/drivers/interfaces/hasher.interface.js";
import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { SessionInvalidError } from "@/errors/session-invalid.error.js";
import { Session } from "@/models/entities/session.entity.js";
import { ISessionsRepository } from "@/models/repositories/interfaces/sessions-repository.interface.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";
import dayjs from "dayjs";

type GetSessionRequest = {
  userId: string;
  refreshToken: string;
};

type GetSessionResponse = {
  session: Session;
};

export class GetSessionService {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly sessionsRepository: ISessionsRepository,
    private readonly hasherDriver: IHasher,
  ) {}

  async execute({
    userId,
    refreshToken,
  }: GetSessionRequest): Promise<GetSessionResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    const session = await this.sessionsRepository.findByUserIdAndRevoked({
      userId,
      isRevoked: false,
    });

    if (!session) {
      throw new SessionInvalidError();
    }

    const isSameHashRefreshToken = await this.hasherDriver.compare({
      plain: refreshToken,
      hashed: session.token_hash,
    });

    if (!isSameHashRefreshToken) {
      throw new SessionInvalidError();
    }

    if (dayjs(new Date()).isAfter(session.expires_at)) {
      throw new SessionInvalidError();
    }

    return { session };
  }
}
