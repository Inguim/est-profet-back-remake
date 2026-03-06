import type { Knex } from "knex";
import dbConnection from "../database/dbConfig.js";
import { UsuarioDTO, type IUsuarioDTO, type TUsuarioStatus, type TUsuarioTipo } from "../dto/UsuarioDTO.js";
import { PasswordService } from "../services/PasswordService.js";
import { BaseModel } from "./BaseModel.js";

export type TCreateModelUsuarioDTO = Required<Omit<IUsuarioDTO, "id" | "created_at" | "updated_at">>;
export type TUpdateModelUsuarioDTO = Partial<Pick<IUsuarioDTO, "nome" | "admin" | "password" | "email" | "status">>;
export type TFindOneModelUsuarioParams = {
	id?: string;
};
export type TListWhereUsuario = {
	nome__ilike?: string;
	status?: TUsuarioStatus;
	tipo?: TUsuarioTipo;
};
export type TListOrderingUsuario = "updated_at__asc";

const LIST_WHERE_KEYS = ["nome__ilike", "status", "tipo"] as const;

export interface IUsuarioModel {
	create(dto: TCreateModelUsuarioDTO): Promise<IUsuarioDTO>;
	update(id: string, dto: TUpdateModelUsuarioDTO): Promise<IUsuarioDTO>;
	delete(id: string): Promise<IUsuarioDTO>;
	populate(id: string): Promise<IUsuarioDTO>;
	findOne(params: TFindOneModelUsuarioParams): Promise<IUsuarioDTO>;
}

export class UsuarioModel
	extends BaseModel<
		UsuarioDTO,
		TCreateModelUsuarioDTO,
		TUpdateModelUsuarioDTO,
		TFindOneModelUsuarioParams,
		TListWhereUsuario,
		TListOrderingUsuario
	>
	implements IUsuarioModel
{
	protected DEFAULT_ORDERING: TListOrderingUsuario = "updated_at__asc";
	protected table: string = "usuarios";
	protected tableTag: string = "Usuário";
	protected dto = UsuarioDTO;
	private passwordService = new PasswordService();

	constructor(connection: Knex = dbConnection) {
		super(connection);
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

	protected applyFilters(
		query: Knex.QueryBuilder<any, IUsuarioDTO[]>,
		where?: TListWhereUsuario,
	): Knex.QueryBuilder<any, IUsuarioDTO[]> {
		if (!where) return query;
		return query.where((qb) => {
			Object.entries(where).forEach(([key, value]) => {
				if (LIST_WHERE_KEYS.includes(key as keyof TListWhereUsuario) && !!value) {
					if (key === "status") qb.where("status", value);
					else if (key === "tipo") qb.where("tipo", value);
					else if (key === "nome__ilike") qb.whereILike("nome", `%${value}%`);
				}
			});
		});
	}
}
