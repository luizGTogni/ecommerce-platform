import {
  IController,
  IHttpRequest,
  IHttpResponse,
} from "@/http/interfaces/controller.interface.js";
import { UserRead } from "@/models/entities/dto/user-read.dto.js";
import { makeCreateUserService } from "@/services/users/factories/make-create.factory.js";
import z from "zod";

interface ICreateUserBody {
  name: string;
  email: string;
  password: string;
}

type CreateUserRequest = IHttpRequest<ICreateUserBody>;

interface IUserResponse {
  user: UserRead;
}

export class CreateUserController
  implements IController<CreateUserRequest, IUserResponse>
{
  async handle(
    request: CreateUserRequest,
  ): Promise<IHttpResponse<IUserResponse>> {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.email(),
      password: z.string().min(6),
    });

    const { name, email, password } = createUserBodySchema.parse(request.body);

    try {
      const useCase = makeCreateUserService();

      const { user } = await useCase.execute({ name, email, password });

      return {
        statusCode: 201,
        body: {
          user,
        },
      };
    } catch (err) {
      throw err;
    }
  }
}
