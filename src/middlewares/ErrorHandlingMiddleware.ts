import type { Request, Response, NextFunction } from "express";
import { BaseError } from "../errors/index.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandlingMiddleware(err: BaseError, _req: Request, res: Response, _next: NextFunction) {
	console.log("Erro capturado: ", err.name);
	console.log(err);
	if (err instanceof BaseError) return err.sendResponse(res);
	return new BaseError({}).sendResponse(res);
}
