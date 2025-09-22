import { User } from "@/models/entities/user.entity.js";
import { UserCreate } from "../../entities/dto/user-create.dto.js";

export interface IUsersRepository {
  create(data: UserCreate): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
