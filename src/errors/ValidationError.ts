import { ZodError } from "zod";
import { BaseError } from "./BaseError.js";
import { STATUS_CODE } from "../utils/constants/status-code.js";
import { formatErrorZod } from "../utils/helpers/formatErrorZod.js";
import { DEFAULT_CONSTRAINTS, type TDeFaultConstraints } from "../utils/constants/default-constraints.js";
import { defaultMessages as dm } from "../validators/index.js";

type TConstraintError = {
	constraint: TDeFaultConstraints;
};

export class ValidationError extends BaseError {
	constructor(error: ZodError | object | TConstraintError, constraintError = false) {
		super({ message: "Erro de validação", status: STATUS_CODE.BAD_REQUEST });
		this.name = "ValidationError";
		if (constraintError) this.createMessageConstraint((error as TConstraintError).constraint);
		else if (error instanceof ZodError) this.createMessage(error);
		else this.errors = error;
	}

	createMessage(error: ZodError) {
		this.errors = formatErrorZod(error);
	}

	createMessageConstraint(constraint: TDeFaultConstraints) {
		this.errors = {
			[DEFAULT_CONSTRAINTS[constraint]]: dm.unique(DEFAULT_CONSTRAINTS[constraint]),
		};
	}
}
