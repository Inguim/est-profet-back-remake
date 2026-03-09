import type { Knex } from "knex";
import { TipoNotificacaoDTO, type ITipoNotificacaoDTO } from "../dto/index.js";
import dbConnection from "../database/dbConfig.js";
import type { TTiposNotificacao } from "../utils/constansts/tipos-notificacao.js";

export interface ITipoNotificacaoModel {
	get(id: string): Promise<ITipoNotificacaoDTO>;
}

export class TipoNotificacaoModel implements ITipoNotificacaoModel {
	protected dto = TipoNotificacaoDTO;

	protected table = "tipos_notificacaos";
	protected tableTag = "Tipo notificação";
	private get db(): Knex.QueryBuilder {
		return this.connection.table(this.table);
	}

	constructor(private readonly connection: Knex = dbConnection) {}

	async get(nome: TTiposNotificacao): Promise<TipoNotificacaoDTO> {
		const tipo_notificacao = await this.db.where({ nome }).first();
		return new this.dto(tipo_notificacao);
	}
}
