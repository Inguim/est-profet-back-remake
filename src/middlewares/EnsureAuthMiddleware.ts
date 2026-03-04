import type { NextFunction, Response, Request } from "express";
import { InvalidTokenError } from "../errors/index.js";
import { TokenService, type ITokenPayload } from "../services/index.js";

export interface IAuthRequest<P = Record<string, any>, ResBody = any, ReqBody = any, ReqQuery = any> extends Request<
	P,
	ResBody,
	ReqBody,
	ReqQuery
> {
	usuarioId?: string;
	usuarioAdmin?: boolean;
}

export function ensureAuthMiddleware(req: IAuthRequest, _res: Response, next: NextFunction): void {
	const authorization = req.headers?.authorization || "";
	const [, token] = authorization.split(" ");
	if (!token) throw new InvalidTokenError();
	const tokenService = new TokenService();
	tokenService.validate(token);
	const { id, admin } = tokenService.decode<ITokenPayload>(token);
	req.usuarioId = id;
	req.usuarioAdmin = admin;
	next();
}
