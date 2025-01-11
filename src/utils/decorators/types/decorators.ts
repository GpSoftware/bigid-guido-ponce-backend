import { Request, RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export enum Methods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  PATCH = 'patch',
  DELETE = 'delete',
}

export interface IRouter {
  method: Methods;
  path: string;
  middlewares?: RequestHandler[];
  handlerName: string | symbol;
}

export interface PrivateRequest extends Request {
  user?: JwtPayload;
}