import type { NextFunction, Response } from "express";
import { InvalidTokenError } from "../errors/index.js";
import { TokenService, type ITokenPayload } from "../services/index.js";
import type { IAuthRequest } from "./index.js";

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
