import type { SessionCreate } from "@/models/entities/dto/session-create.dto.js";
import type { Session } from "@/models/entities/session.entity.js";
import { randomUUID } from "node:crypto";
import type {
  IFindByUserIdAndRevokedProps,
  ISessionsRepository,
} from "../interfaces/sessions-repository.interface.js";

export class InMemorySessionsRepository implements ISessionsRepository {
  private sessions: Session[] = [];

  async create({ user_id, token_hash, expires_at }: SessionCreate) {
    const sessionCreated: Session = {
      id: randomUUID(),
      user_id,
      token_hash,
      expires_at,
      revoked: false,
      created_at: new Date(),
    };

    this.sessions.push(sessionCreated);

    return sessionCreated;
  }

  async save(sessionData: Session) {
    const sessionIndex = this.sessions.findIndex(
      (session) => session.id === sessionData.id,
    );
    this.sessions[sessionIndex] = sessionData;
  }

  async findByUserIdAndRevoked({
    userId,
    isRevoked,
  }: IFindByUserIdAndRevokedProps) {
    return (
      this.sessions.find(
        (session) =>
          session.user_id === userId && session.revoked === isRevoked,
      ) || null
    );
  }
}
