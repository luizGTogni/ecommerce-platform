import { prisma } from "@/configs/prisma.js";
import type { SessionCreate } from "@/models/entities/dto/session-create.dto.js";
import type { Session } from "@/models/entities/session.entity.js";
import type {
  IFindByUserIdAndRevokedProps,
  ISessionsRepository,
} from "../interfaces/sessions-repository.interface.js";

export class PrismaSessionsRepository implements ISessionsRepository {
  async create(data: SessionCreate) {
    const session = await prisma.session.create({
      data,
    });

    return session;
  }

  async save(sessionData: Session) {
    await prisma.session.update({
      where: {
        id: sessionData.id,
      },
      data: {
        revoked: sessionData.revoked,
      },
    });
  }

  async findByUserIdAndRevoked({
    userId,
    isRevoked,
  }: IFindByUserIdAndRevokedProps) {
    return await prisma.session.findFirst({
      where: {
        user_id: userId,
        revoked: isRevoked,
      },
    });
  }

  async deleteManyByUserId(userId: string) {
    await prisma.session.deleteMany({
      where: {
        user_id: userId,
      },
    });
  }
}
