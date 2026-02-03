import type { Request, Response, NextFunction } from "express";
import { BaseError, ValidationError } from "../errors/index.js";
import {} from "knex";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandlingMiddleware(err: BaseError, _req: Request, res: Response, _next: NextFunction) {
	console.log("Erro capturado: ", err.name);
	console.log(err);
	if (err.message.includes("unique constraint")) return new ValidationError(err, true).sendResponse(res);
	if (err instanceof BaseError) return err.sendResponse(res);
	return new BaseError({}).sendResponse(res);
}
