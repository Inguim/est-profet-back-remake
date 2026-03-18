import type { ITipoNotificacaoDTO, TipoNotificacaoDTO } from "../dto/TipoNotificacaoDTO.js";
import { TipoNotificacaoModel } from "../models/TipoNotificacaoModel.js";
import type { TTiposNotificacao } from "../utils/constants/tipos-notificacao.js";

export interface ITipoNotificacaoService {
	get(nome: TTiposNotificacao): Promise<ITipoNotificacaoDTO>;
}

export class TipoNotificacaoService implements ITipoNotificacaoService {
	private model = TipoNotificacaoModel;

	async get(nome: TTiposNotificacao): Promise<TipoNotificacaoDTO> {
		const model = new this.model();
		const tipoNotificacao = await model.get(nome);
		return tipoNotificacao;
	}
}
