import { ResourceNotFoundError } from "@/errors/resource-not-found.error.js";
import { UserRead } from "@/models/entities/dto/user-read.dto.js";
import { IUsersRepository } from "@/models/repositories/interfaces/users-repository.interface.js";

type GetUserProfileRequest = {
  userId: string;
};

type GetUserProfileResponse = {
  user: UserRead;
};

export class GetUserProfileService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileRequest): Promise<GetUserProfileResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return { user };
  }
}
