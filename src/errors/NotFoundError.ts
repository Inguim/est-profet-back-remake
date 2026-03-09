import { STATUS_CODE } from "../utils/constants/status-code.js";
import { BaseError } from "./BaseError.js";

export class NotFoundError extends BaseError {
	constructor(message = "Recurso não encontrado") {
		super({ name: "NotFoundError", message, status: STATUS_CODE.NOT_FOUND });
	}
}
