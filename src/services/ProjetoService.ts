import type { Knex } from "knex";
import { ProjetoDTO, type IProjetoDTO } from "../dto/ProjetoDTO.js";
import type { TUsuarioProjetoRelacao } from "../dto/UsuarioProjetoDTO.js";
import type { IUsuarioProjetoService } from "./UsuarioProjetoService.js";
import dbConnection from "../database/dbConfig.js";
import { ProjetoModel } from "../models/ProjetoModel.js";

type TCreateProjetoMembro = {
	user_id: string;
	relacao: TUsuarioProjetoRelacao;
};

type TCreateDTO = Omit<IProjetoDTO, "id" | "created_at" | "updated_at" | "status">;

type TConstructorService = {
	connection?: Knex;
	usuarioProjetoService: IUsuarioProjetoService;
};

export interface IProjetoService {
	create(dto: TCreateDTO, membrosDTO: TCreateProjetoMembro[]): Promise<IProjetoDTO>;
}

export class ProjetoService implements IProjetoService {
	private connection: Knex;
	private model = ProjetoModel;
	private usuarioProjetoService: IUsuarioProjetoService;

	constructor({ usuarioProjetoService, connection = dbConnection }: TConstructorService) {
		this.usuarioProjetoService = usuarioProjetoService;
		this.connection = connection;
	}

	async create(dto: TCreateDTO, membrosDTO: TCreateProjetoMembro[]): Promise<ProjetoDTO> {
		return this.connection.transaction(async (trx) => {
			const { nome, objetivo, categoria_id, conclusao, estado_id, introducao, metodologia, result_disc, resumo } = dto;
			const model = new this.model(trx);
			const projeto = await model.create({
				nome,
				objetivo,
				categoria_id,
				conclusao,
				estado_id,
				introducao,
				metodologia,
				result_disc,
				resumo,
				status: "analise",
			});
			await this.vincularMembros(String(projeto.id), membrosDTO, trx);
			return projeto;
		});
	}

	private async vincularMembros(projetoId: string, membros: TCreateProjetoMembro[], trx: Knex): Promise<void> {
		for (const membro of membros) {
			const { relacao, user_id } = membro;
			await this.usuarioProjetoService.create({ projeto_id: projetoId, user_id, relacao }, trx);
		}
	}
}
