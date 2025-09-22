import { User } from "@/models/entities/user.entity.js";
import { UserCreate } from "@/models/entities/dto/user-create.dto.js";

export interface IUsersRepository {
  create(data: UserCreate): Promise<User>;
  save(userEdited: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  searchMany(query: string, page: number): Promise<User[]>;
}
