import type { Response, NextFunction } from "express";
import { solicitacaoValidator } from "../validators/index.js";
import { ValidationError } from "../errors/ValidationError.js";
import type { ZodError } from "zod";
import type { TRequestCreateSolicitacao } from "../controllers/SolicitacaoController.js";

function create(req: TRequestCreateSolicitacao, res: Response, next: NextFunction) {
	const validator = new solicitacaoValidator.CreateValidator();
	const result = validator.validate(req.body);
	if (!result.success) throw new ValidationError(result.extra?.error as ZodError);
	next();
}

function update(req: TRequestCreateSolicitacao, res: Response, next: NextFunction) {
	const validator = new solicitacaoValidator.UpdateValidator();
	const result = validator.validate(req.body);
	if (!result.success) throw new ValidationError(result.extra?.error as ZodError);
	next();
}

export const ValidateSolicitacaoMiddleware = {
	create,
	update,
};
