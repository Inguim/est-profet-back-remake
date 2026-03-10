import type { IBaseDTO } from "./BaseDTO.js";
import type { TSolicitacaoStatus, TSolicitacaoStatusLabel } from "./SolicitacaoDTO.js";

export type TNotificacaoTipo = {
	id: string;
	nome: string;
};

export type TNotificacaoSolicitacao = {
	id: string;
	titulo: string;
	descricao: string;
	status: {
		value: TSolicitacaoStatus;
		label: TSolicitacaoStatusLabel;
	};
};

export interface INotificacaoDTO extends IBaseDTO {
	visto: boolean;
	tipo: TNotificacaoTipo;
	solicitacao: TNotificacaoSolicitacao;
	user_id: string;
}

export class NotificacaoDTO implements INotificacaoDTO {
	readonly id?: string | null;
	readonly created_at?: Date;
	readonly updated_at?: Date;
	readonly visto: boolean;
	readonly tipo: TNotificacaoTipo;
	readonly solicitacao: TNotificacaoSolicitacao;
	readonly user_id: string;

	constructor({ id = null, created_at, updated_at, visto, tipo, solicitacao, user_id }: INotificacaoDTO) {
		this.id = id;
		this.visto = visto;
		this.tipo = tipo;
		this.solicitacao = solicitacao;
		this.user_id = user_id;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}
}
