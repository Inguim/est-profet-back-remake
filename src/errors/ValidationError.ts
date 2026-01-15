import { ZodError } from "zod";
import { BaseError } from "./BaseError.js";
import { STATUS_CODE } from "../utils/constansts/status-code.js";
import { formatErrorZod } from "../utils/helpers/formatErrorZod.js";

export class ValidationError extends BaseError {
	constructor(error: ZodError | string) {
		super({ message: "Erro de validação", status: STATUS_CODE.BAD_REQUEST });
		this.name = "ValidationError";
		if (error instanceof ZodError) this.createMessage(error);
	}

	createMessage(error: ZodError) {
		this.errors = formatErrorZod(error);
	}
}
