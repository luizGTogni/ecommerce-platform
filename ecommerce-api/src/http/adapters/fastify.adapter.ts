import { FastifyReply, FastifyRequest } from "fastify";
import {
  IController,
  IHttpRequest,
} from "../interfaces/controller.interface.js";

export const fastifyRouteAdapter =
  <B, P, Q, Res>(controller: IController<IHttpRequest<B, P, Q>, Res>) =>
  async (
    req: FastifyRequest<{ Body: B; Params: P; Querystring: Q }>,
    reply: FastifyReply,
  ) => {
    const httpRequest: IHttpRequest<B, P, Q> = {
      body: req.body as B,
      params: req.params as P,
      query: req.query as Q,
    };

    const httpResponse = await controller.handle(httpRequest);
    reply.status(httpResponse.statusCode).send(httpResponse.body);
  };
