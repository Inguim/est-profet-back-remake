import { STATUS_CODE } from "../utils/constants/status-code.js";
import { BaseError } from "./index.js";

export class InvalidTokenError extends BaseError {
	constructor() {
		super({ name: "InvalidTokenError", message: "Token inválido", status: STATUS_CODE.UNAUTHORIZED });
	}
}
