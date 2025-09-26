import type { SessionCreate } from "@/models/entities/dto/session-create.dto.js";
import type { Session } from "@/models/entities/session.entity.js";

export interface IFindByUserIdAndRevokedProps {
  userId: string;
  isRevoked: boolean;
}

export interface ISessionsRepository {
  create(data: SessionCreate): Promise<Session>;
  save(sessionData: Session): Promise<void>;
  findByUserIdAndRevoked(
    props: IFindByUserIdAndRevokedProps,
  ): Promise<Session | null>;
}
