import type { IUsuarioDTO } from "../dto/UsuarioDTO.js";
import { PasswordService } from "../services/PasswordService.js";
import { BaseModel } from "./BaseModel.js";

export class Usuario extends BaseModel<IUsuarioDTO> {
	nome = "";
	email = "";
	password = "";
	tipo = "aluno";
	status = "analise";
	admin = false;

	private passwordService = new PasswordService();

	constructor(fields: Partial<IUsuarioDTO> = {}) {
		super(fields);
		this.table = "usuarios";
		this.tableTag = "Usuário";
	}

	protected async beforeCreate(): Promise<void> {
		this.password = await this.passwordService.hash(this.password);
	}
}
