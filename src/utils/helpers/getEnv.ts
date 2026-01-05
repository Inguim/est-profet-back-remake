import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

import { EnvConfigError } from "../../erros/index.js";

export function getEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new EnvConfigError(name);
	}
	return value;
}
