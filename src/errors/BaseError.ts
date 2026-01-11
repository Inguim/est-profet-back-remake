import type { Response } from "express";

export class BaseError extends Error {
	status: number;
	errors: object;

	constructor({ name = "Error", message = "Error no Servidor", status = 500 }) {
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
