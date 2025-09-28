import { SessionInvalidError } from "@/errors/session-invalid.error.js";
import { Session } from "@/models/entities/session.entity.js";
import { IMemcacheRepository } from "@/models/repositories/interfaces/memcache-repository.interface.js";
import { ISessionsRepository } from "@/models/repositories/interfaces/sessions-repository.interface.js";

type LogoutSessionRequest = {
  userId: string;
  token: string;
};

type LogoutSessionResponse = {
  session: Session;
};

export class LogoutSessionService {
  constructor(
    private readonly sessionsRepository: ISessionsRepository,
    private readonly memcacheRepository: IMemcacheRepository,
  ) {}

  async execute({
    userId,
    token,
  }: LogoutSessionRequest): Promise<LogoutSessionResponse> {
    const session = await this.sessionsRepository.findByUserIdAndRevoked({
      userId,
      isRevoked: false,
    });

    if (!session) {
      throw new SessionInvalidError();
    }

    session.revoked = true;
    await this.sessionsRepository.save(session);

    await this.memcacheRepository.set({
      key: `revoked_list_${session.user_id}`,
      value: token,
      expireAt: 900,
    });

    return { session };
  }
}
