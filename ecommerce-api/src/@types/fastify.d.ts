import "fastify";

declare module "fastify" {
  interface FastifyReply {
    user: {
      sub: string | null;
    };
  }
}
