import type { Response } from "express";
import { STATUS_CODE, type TStatusCode } from "../utils/constansts/status-code.js";

export class BaseError extends Error {
	status: TStatusCode;
	errors: object;

	constructor({
		name = "Error",
		message = "Error no Servidor",
		status = STATUS_CODE.INTERNAL_SERVER_ERROR,
	}: {
		name?: string;
		message?: string;
		status?: TStatusCode;
	}) {
		super(message);
		this.name = name;
		this.status = status;
		this.message = message;
		this.errors = {};
		Object.setPrototypeOf(this, new.target.prototype);
	}

	sendResponse(res: Response) {
		return res.status(this.status).json({
			message: this.message,
			status: this.status,
			errors: this.errors,
		});
	}
}
