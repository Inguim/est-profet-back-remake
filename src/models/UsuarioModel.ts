import { UsuarioDTO, type IUsuarioDTO } from "../dto/UsuarioDTO.js";
import { PasswordService } from "../services/PasswordService.js";
import { BaseModel, type TCreateModelDTO, type TUpdateModelDTO } from "./BaseModel.js";

export class UsuarioModel extends BaseModel<IUsuarioDTO> {
	protected dto = UsuarioDTO;
	private passwordService = new PasswordService();

	constructor() {
		super();
		this.table = "usuarios";
		this.tableTag = "Usuário";
	}

	private async hashPassword(password: string): Promise<string> {
		return await this.passwordService.hash(password);
	}

	protected async beforeCreate(dto: TCreateModelDTO<IUsuarioDTO>): Promise<TCreateModelDTO<IUsuarioDTO>> {
		return { ...dto, password: await this.hashPassword(dto.password as string) };
	}

	protected async beforeUpdate(dto: TUpdateModelDTO<IUsuarioDTO>): Promise<TUpdateModelDTO<IUsuarioDTO>> {
		if (dto.password) dto.password = await this.hashPassword(dto.password);
		return { ...dto };
	}
}
