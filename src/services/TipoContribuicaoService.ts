import type { ITipoContribuicaoDTO, TipoContribuicaoDTO } from "../dto/TipoContribuicaoDTO.js";
import { TipoContribuicaoModel } from "../models/TipoContribuicaoModel.js";
import type { TTiposContribuicao } from "../utils/constants/tipos-contribuicao.js";

export interface ITipoContribuicaoService {
	get(nome: TTiposContribuicao): Promise<ITipoContribuicaoDTO>;
	list(): Promise<ITipoContribuicaoDTO[]>;
}

export class TipoContribuicaoService implements ITipoContribuicaoService {
	private model = TipoContribuicaoModel;

	async get(nome: TTiposContribuicao): Promise<TipoContribuicaoDTO> {
		const model = new this.model();
		const tipoNotificacao = await model.get(nome);
		return tipoNotificacao;
	}

	async list(): Promise<TipoContribuicaoDTO[]> {
		const model = new this.model();
		const tiposContribuicao = await model.list();
		return tiposContribuicao;
	}
}
