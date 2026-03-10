import type { IBaseDTO } from "./BaseDTO.js";
import type { TSolicitacaoStatus, TSolicitacaoStatusLabel } from "./SolicitacaoDTO.js";

export type TNotificacaoSolicitacao = {
	id: string;
	titulo: string;
	descricao: string;
	status: {
		value: TSolicitacaoStatus;
		label: TSolicitacaoStatusLabel;
	};
	projeto: {
		id: string;
		nome: string;
	};
};

export interface INotificacaoDTO extends IBaseDTO {
	visto: boolean;
	tipo_id: string;
	solicitacao: TNotificacaoSolicitacao;
	user_id: string;
}

export class NotificacaoDTO implements INotificacaoDTO {
	readonly id?: string | null;
	readonly created_at?: Date;
	readonly updated_at?: Date;
	readonly visto: boolean;
	readonly tipo_id: string;
	readonly solicitacao: TNotificacaoSolicitacao;
	readonly user_id: string;

	constructor({ id = null, created_at, updated_at, visto, tipo_id, solicitacao, user_id }: INotificacaoDTO) {
		this.id = id;
		this.visto = visto;
		this.tipo_id = tipo_id;
		this.solicitacao = solicitacao;
		this.user_id = user_id;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}
}
