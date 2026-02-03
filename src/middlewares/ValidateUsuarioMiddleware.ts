import type { TUsuarioTipo } from "../dto/index.js";
import type { Request, Response, NextFunction } from "express";
import { userValidator } from "../validators/index.js";
import { ValidationError } from "../errors/ValidationError.js";
import type { ZodError } from "zod";

export type CreateDTO = {
	nome: string;
	email: string;
	tipo: TUsuarioTipo;
	password: string;
	confirm_password: string;
};

export type UpdateDTO = {
	nome: string;
};

type TRequestCreate = Request<any, any, CreateDTO>;

type RequestUpdate = Request<{ id: string }, any, UpdateDTO>;

function create(req: TRequestCreate, res: Response, next: NextFunction) {
	const validator = new userValidator.CreateValidator();
	const result = validator.validate(req.body);
	if (!result.success) throw new ValidationError(result.extra?.error as ZodError);
	next();
}

function update(req: RequestUpdate, res: Response, next: NextFunction) {
	const validator = new userValidator.UpdateValidator();
	const result = validator.validate(req.body);
	if (!result.success) throw new ValidationError(result.extra?.error as ZodError);
	next();
}

export const ValidateUsuarioMiddleware = {
	create,
	update,
};
