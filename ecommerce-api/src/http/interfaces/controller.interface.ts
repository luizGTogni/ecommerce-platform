export interface IHttpResponse<T = unknown> {
  statusCode: number;
  body: T;
}

export interface IHttpRequest<B = unknown, P = unknown, Q = unknown> {
  body: B;
  params: P;
  query: Q;
}

export interface IController<Req, Res> {
  handle(request: Req): Promise<IHttpResponse<Res>>;
}
