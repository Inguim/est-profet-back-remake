import type { Request, Response, NextFunction } from "express";
import { userValidator } from "../validators/index.js";
import { ValidationError } from "../errors/ValidationError.js";
import type { ZodError } from "zod";
import type {
	TCreateDTO as TCreateDTOUsuarioController,
	TUpdateDTO as TUpdateDTOUsuarioController,
} from "../controllers/UsuarioController.js";

export type TCreateDTO = TCreateDTOUsuarioController;

export type TUpdateDTO = TUpdateDTOUsuarioController;

type TRequestCreate = Request<any, any, TCreateDTO>;

type RequestUpdate = Request<{ id: string }, any, TUpdateDTO>;

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
