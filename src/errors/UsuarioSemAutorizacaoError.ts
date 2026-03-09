import { STATUS_CODE } from "../utils/constants/status-code.js";
import { BaseError } from "./BaseError.js";

export class UsuarioSemAutorizacaoError extends BaseError {
	constructor() {
		super({
			name: "UsuarioSemAutorizacaoError",
			message: "Você não tem autorização para executar essa ação",
			status: STATUS_CODE.UNAUTHORIZED,
		});
	}
}
