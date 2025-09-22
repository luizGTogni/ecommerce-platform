import { User } from "@/models/entities/user.entity.js";
import { UserCreate } from "./dto/user-create.dto.js";

export interface IUsersRepository {
  create(data: UserCreate): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
