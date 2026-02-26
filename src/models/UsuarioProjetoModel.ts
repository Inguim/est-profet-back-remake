import type { Knex } from "knex";
import type { IUsuarioProjetoDTO } from "../dto/index.js";
import { UsuarioProjetoDTO } from "../dto/UsuarioProjetoDTO.js";
import dbConnection from "../database/dbConfig.js";
import { v4 as uuidV4 } from "uuid";

type TCreateModelDTO = Omit<IUsuarioProjetoDTO, "id" | "created_at" | "updated_at">;

export interface IUsuarioProjetoModel {
	create(dto: TCreateModelDTO): Promise<IUsuarioProjetoDTO>;
	list(projetoId: string): Promise<IUsuarioProjetoDTO[]>;
}

export class UsuarioProjetoModel implements IUsuarioProjetoModel {
	protected dto = UsuarioProjetoDTO;

	protected table = "usuario_projs";
	protected tableTag = "Usuário projeto";
	private get db(): Knex.QueryBuilder {
		return this.connection.table(this.table);
	}

	constructor(private readonly connection: Knex = dbConnection) {}

	async create(dto: TCreateModelDTO): Promise<UsuarioProjetoDTO> {
		const { projeto_id, relacao, user_id } = dto;
		const usuarioProjeto = new this.dto({
			id: uuidV4(),
			projeto_id,
			relacao,
			user_id,
			created_at: new Date(),
			updated_at: new Date(),
		});
		const [newUsuarioProjeto] = await this.db.insert(usuarioProjeto).returning("*");
		return new this.dto(newUsuarioProjeto);
	}

	async list(projetoId: string): Promise<UsuarioProjetoDTO[]> {
		const usuariosProjeto = await this.db
			.select<IUsuarioProjetoDTO[]>("id", "relacao", "projeto_id", "user_id")
			.where({ projeto_id: projetoId });
		return usuariosProjeto.map((usuarioProjeto) => new this.dto(usuarioProjeto));
	}
}
