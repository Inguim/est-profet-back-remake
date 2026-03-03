import type { Response, NextFunction } from "express";
import { projetoValidator } from "../validators/index.js";
import { ValidationError } from "../errors/ValidationError.js";
import type { ZodError } from "zod";
import type { TRequestCreateProjeto, TRequestUpdateProjeto } from "../controllers/ProjetoController.js";

function create(req: TRequestCreateProjeto, res: Response, next: NextFunction) {
	const validator = new projetoValidator.CreateValidator();
	const { projeto, membros } = req.body;
	const result = validator.validate({ ...(projeto || {}), membros });
	if (!result.success) throw new ValidationError(result.extra?.error as ZodError);
	next();
}

function update(req: TRequestUpdateProjeto, res: Response, next: NextFunction) {
	const validator = new projetoValidator.UpdateValidator();
	const result = validator.validate(req.body);
	if (!result.success) throw new ValidationError(result.extra?.error as ZodError);
	next();
}

export const ValidateProjetoMiddleware = {
	create,
	update,
};
