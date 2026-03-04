import type { Knex } from "knex";
import dbConnection from "../database/dbConfig.js";
import { UsuarioDTO, type IUsuarioDTO } from "../dto/UsuarioDTO.js";
import { PasswordService } from "../services/PasswordService.js";
import { BaseModel } from "./BaseModel.js";

export type TCreateModelUsuarioDTO = Required<Omit<IUsuarioDTO, "id" | "created_at" | "updated_at">>;
export type TUpdateModelUsuarioDTO = Partial<Pick<IUsuarioDTO, "nome" | "admin" | "password" | "email" | "status">>;
export type TFindOneModelUsuarioParams = {
	id?: string;
};

export interface IUsuarioModel {
	create(dto: TCreateModelUsuarioDTO): Promise<IUsuarioDTO>;
	update(id: string, dto: TUpdateModelUsuarioDTO): Promise<IUsuarioDTO>;
	delete(id: string): Promise<IUsuarioDTO>;
	populate(id: string): Promise<IUsuarioDTO>;
	findOne(params: TFindOneModelUsuarioParams): Promise<IUsuarioDTO>;
}

export class UsuarioModel
	extends BaseModel<IUsuarioDTO, TCreateModelUsuarioDTO, TUpdateModelUsuarioDTO, TFindOneModelUsuarioParams>
	implements IUsuarioModel
{
	protected dto = UsuarioDTO;
	private passwordService = new PasswordService();

	constructor(connection: Knex = dbConnection) {
		super(connection);
		this.table = "usuarios";
		this.tableTag = "Usuário";
	}

	private async hashPassword(password: string): Promise<string> {
		return await this.passwordService.hash(password);
	}

	protected async beforeCreate(dto: TCreateModelUsuarioDTO): Promise<TCreateModelUsuarioDTO> {
		return { ...dto, password: await this.hashPassword(dto.password as string), status: "analise" };
	}

	protected async beforeUpdate(dto: TUpdateModelUsuarioDTO): Promise<TUpdateModelUsuarioDTO> {
		if (dto.password) dto.password = await this.hashPassword(dto.password);
		return { ...dto };
	}
}
