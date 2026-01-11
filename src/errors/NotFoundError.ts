import { BaseError } from "./BaseError.js";

export class NotFoundError extends BaseError {
	constructor(message = "Recurso não encontrado") {
		super({ name: "NotFoundError", message, status: 404 });
	}
}
