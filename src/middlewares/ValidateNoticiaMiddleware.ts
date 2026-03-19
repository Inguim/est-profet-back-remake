import type { Request, Response, NextFunction } from "express";
import { noticiaValidator } from "../validators/index.js";
import { ValidationError } from "../errors/ValidationError.js";
import type { ZodError } from "zod";
import type { TCreateDTONoticiaController, TUpdateDTONoticiaController } from "../controllers/NoticiaController.js";

export type TCreateDTONoticiaMiddleware = TCreateDTONoticiaController;

export type TUpdateDTONoticiaMiddleware = TUpdateDTONoticiaController;

type TRequestCreate = Request<any, any, TCreateDTONoticiaMiddleware>;

type RequestUpdate = Request<{ id: string }, any, TUpdateDTONoticiaMiddleware>;

function create(req: TRequestCreate, res: Response, next: NextFunction) {
	const validator = new noticiaValidator.CreateValidator();
	const result = validator.validate(req.body);
	if (!result.success) throw new ValidationError(result.extra?.error as ZodError);
	next();
}

function update(req: RequestUpdate, res: Response, next: NextFunction) {
	const validator = new noticiaValidator.UpdateValidator();
	const result = validator.validate(req.body);
	if (!result.success) throw new ValidationError(result.extra?.error as ZodError);
	next();
}

export const ValidateNoticiaMiddleware = {
	create,
	update,
};
