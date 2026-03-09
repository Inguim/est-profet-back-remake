import { STATUS_CODE } from "../utils/constants/status-code.js";
import { BaseError } from "./index.js";

export class ExpiredTokenError extends BaseError {
	constructor() {
		super({ name: "ExpiredTokenError", message: "Token expirado", status: STATUS_CODE.UNAUTHORIZED });
	}
}
