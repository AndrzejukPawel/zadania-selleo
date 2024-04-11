import { RequestHandler } from "express";
export type HttpMethod = "all" | "get" | "post" | "put" | "delete" | "patch" | "options" | "head"
export interface IRequest {
  httpMethod: HttpMethod;
  path: string;
  handler: RequestHandler;
}
