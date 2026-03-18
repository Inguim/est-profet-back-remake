import type { Request, Response, NextFunction } from "express";
import { contribuidorValidator } from "../validators/index.js";
import { ValidationError } from "../errors/ValidationError.js";
import type { ZodError } from "zod";
import type {
	TRequestCreateContribuidorDTO,
	TRequestUpdateContribuidorDTO,
} from "../controllers/ContribuidorController.js";

export type TCreateDTOContribuidorMiddleware = TRequestCreateContribuidorDTO;

export type TUpdateDTOContribuidorMiddleware = TRequestUpdateContribuidorDTO;

type TRequestCreate = Request<any, any, TCreateDTOContribuidorMiddleware>;

type RequestUpdate = Request<{ id: string }, any, TUpdateDTOContribuidorMiddleware>;

function create(req: TRequestCreate, res: Response, next: NextFunction) {
	const validator = new contribuidorValidator.CreateValidator();
	const result = validator.validate(req.body);
	if (!result.success) throw new ValidationError(result.extra?.error as ZodError);
	next();
}

function update(req: RequestUpdate, res: Response, next: NextFunction) {
	const validator = new contribuidorValidator.UpdateValidator();
	const result = validator.validate(req.body);
	if (!result.success) throw new ValidationError(result.extra?.error as ZodError);
	next();
}

export const ValidateContribuidorMiddleware = {
	create,
	update,
};
