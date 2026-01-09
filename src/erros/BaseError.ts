export abstract class BaseError extends Error {
	status: number;

	constructor({ name = "Error", message = "Error no Servidor", status = 500 }) {
		super(message);
		this.name = name;
		this.status = status;
		this.message = message;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
