import { User } from "@/models/entities/user.entity.js";
import { UserCreate } from "../interfaces/dto/user-create.dto.js";
import { IUsersRepository } from "../interfaces/users-repository.interface.js";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements IUsersRepository {
  private users: User[] = [];

  async create({ name, email, password_hash }: UserCreate) {
    const userCreated: User = {
      id: randomUUID(),
      name,
      email,
      password_hash,
      session_hash: null,
      created_at: new Date(),
    };

    this.users.push(userCreated);

    return userCreated;
  }

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email) || null;
  }
}
