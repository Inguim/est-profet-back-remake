import type { Knex } from "knex";
import { UsuarioProjetoDTO, type IUsuarioProjetoDTO } from "../dto/UsuarioProjetoDTO.js";
import { UsuarioProjetoModel } from "../models/UsuarioProjetoModel.js";

type TCreateDTO = Omit<IUsuarioProjetoDTO, "id" | "created_at" | "updated_at">;

export interface IUsuarioProjetoService {
	create(dto: TCreateDTO, transaction?: Knex): Promise<IUsuarioProjetoDTO>;
	list(projetoId: string): Promise<IUsuarioProjetoDTO[]>;
}

export class UsuarioProjetoService implements IUsuarioProjetoService {
	protected model = UsuarioProjetoModel;
	protected dto = UsuarioProjetoDTO;

	async create(dto: TCreateDTO, transaction?: Knex): Promise<UsuarioProjetoDTO> {
		const { projeto_id, relacao, user_id } = dto;
		const model = new this.model(transaction);
		const usuarioProjeto = await model.create({ relacao, projeto_id, user_id });
		return usuarioProjeto;
	}

	async list(projetoId: string): Promise<IUsuarioProjetoDTO[]> {
		const model = new this.model();
		const usuarioProjetos = await model.list(projetoId);
		return usuarioProjetos;
	}
}
