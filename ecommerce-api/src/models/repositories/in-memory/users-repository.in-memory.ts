import { User } from "@/models/entities/user.entity.js";
import { UserCreate } from "../../entities/dto/user-create.dto.js";
import { IUsersRepository } from "../interfaces/users-repository.interface.js";
import { randomUUID } from "node:crypto";

export class InMemoryUsersRepository implements IUsersRepository {
  private users: User[] = [];

  private NUMBERS_BY_PAGE = 20;

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

  async save(userEdited: User) {
    const userIndex = this.users.findIndex((user) => user.id === userEdited.id);
    this.users[userIndex] = userEdited;
  }

  async delete(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
  }

  async findById(id: string) {
    return this.users.find((user) => user.id === id) || null;
  }

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email) || null;
  }

  async searchMany(query: string, page: number = 1) {
    const initialIndex = (page - 1) * this.NUMBERS_BY_PAGE;
    const untialIndex = page * this.NUMBERS_BY_PAGE;

    return this.users
      .filter(
        (user) =>
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.name.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(initialIndex, untialIndex);
  }
}
