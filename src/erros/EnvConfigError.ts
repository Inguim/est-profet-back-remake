export class EnvConfigError extends Error {
	constructor(variableName: string) {
		super(`Variável de ambiente ${variableName} não definida`);

		this.name = "EnvConfigError";

		Object.setPrototypeOf(this, new.target.prototype);
	}
}
