import { prisma } from "@/configs/prisma.js";
import { User } from "@/models/entities/user.entity.js";
import { UserCreate } from "../../entities/dto/user-create.dto.js";
import { IUsersRepository } from "../interfaces/users-repository.interface.js";

export class PrismaUsersRepository implements IUsersRepository {
  private NUMBERS_BY_PAGE = 20;

  async create(data: UserCreate) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  async save(userEdited: User) {
    await prisma.user.update({
      where: {
        id: userEdited.id,
      },
      data: {
        name: userEdited.name,
        email: userEdited.email,
        password_hash: userEdited.password_hash,
      },
    });
  }

  async delete(id: string) {
    await prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async searchMany(query: string, page: number = 1) {
    const initialPage = (page - 1) * this.NUMBERS_BY_PAGE;
    const untilPage = page * this.NUMBERS_BY_PAGE;

    return await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
          {
            email: {
              contains: query,
            },
          },
        ],
      },
      skip: initialPage,
      take: untilPage,
    });
  }
}
