import type { NextFunction, Response } from "express";
import { UsuarioSemAutorizacaoError } from "../errors/index.js";
import type { IAuthRequest } from "./EnsureAuthMiddleware.js";

export function ensureAdminMiddleware(req: IAuthRequest, _res: Response, next: NextFunction): void {
	const { usuarioAdmin } = req;
	if (!usuarioAdmin) throw new UsuarioSemAutorizacaoError();
	next();
}
