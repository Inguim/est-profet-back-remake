import { TipoContribuicaoDTO, type ITipoContribuicaoDTO } from "../dto/TipoContribuicaoDTO.js";
import dbConnection from "../database/dbConfig.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import type { Knex } from "knex";
import { TIPOS_CONTRUIBUICAO, type TTiposContribuicao } from "../utils/constants/tipos-contribuicao.js";

export interface ITipoContribuicaoModel {
	get(id: TTiposContribuicao): Promise<ITipoContribuicaoDTO>;
	list(): Promise<ITipoContribuicaoDTO[]>;
}

export class TipoContribuicaoModel implements ITipoContribuicaoModel {
	protected table = "tipo_contribuicaos";
	protected tableTag = "Tipo contribuição";
	protected dto = TipoContribuicaoDTO;

	private get db(): Knex.QueryBuilder {
		return this.connection.table(this.table);
	}

	constructor(private readonly connection: Knex = dbConnection) {}

	async get(nome: TTiposContribuicao): Promise<TipoContribuicaoDTO> {
		const row = await await this.db.where({ nome: TIPOS_CONTRUIBUICAO[nome] }).first();
		if (!row) throw new NotFoundError(`${this.tableTag} não encontrado`);
		return new this.dto(row);
	}

	async list(): Promise<TipoContribuicaoDTO[]> {
		const rows = await this.db.select<TipoContribuicaoDTO[]>("id", "nome").orderBy("nome", "asc");
		return rows.map((row) => new this.dto(row));
	}
}
