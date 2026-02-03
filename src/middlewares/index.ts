import { type Request } from "express";

export interface IAuthRequest extends Request {
	usuarioId?: string;
	usuarioAdmin?: boolean;
}

export * from "./ValidateUsuarioMiddleware.js";
export * from "./ErrorHandlingMiddleware.js";
export * from "./EnsureAuthMiddleware.js";
