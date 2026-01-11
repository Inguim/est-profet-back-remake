import { UsuarioDTO, type IUsuarioDTO } from "../dto/UsuarioDTO.js";
import { PasswordService } from "../services/PasswordService.js";
import { BaseModel } from "./BaseModel.js";

export class Usuario extends BaseModel<IUsuarioDTO> {
	private passwordService = new PasswordService();

	constructor(fields: Partial<IUsuarioDTO> = {}) {
		super(new UsuarioDTO(fields));
		this.table = "usuarios";
		this.tableTag = "Usuário";
	}

	protected async beforeCreate(): Promise<void> {
		this.dto.password = await this.passwordService.hash(this.dto.password);
	}
}
