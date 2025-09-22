import { User } from "@/models/entities/user.entity.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";

type SearchUsersRequest = {
  query: string;
  page: number;
};

type SearchUsersResponse = {
  users: User[];
};

export class SearchUsersService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({
    query,
    page,
  }: SearchUsersRequest): Promise<SearchUsersResponse> {
    const users = await this.usersRepository.searchMany(query, page);

    return { users };
  }
}
