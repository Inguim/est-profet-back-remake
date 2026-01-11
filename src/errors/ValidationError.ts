import { ZodError } from "zod";
import { BaseError } from "./BaseError.js";

export class ValidationError extends BaseError {
	constructor(error: ZodError | string) {
		super({ message: "Erro de validação", status: 400 });
		this.name = "ValidationError";
		if (error instanceof ZodError) this.createMessage(error);
	}

	createMessage(error: ZodError) {
		error.issues.forEach((issue) => {
			const path = issue.path[0] || "unknown_field";
			Object.assign(this.errors, { [path]: issue.message });
		});
	}
}
