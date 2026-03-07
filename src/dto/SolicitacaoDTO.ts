import type { IBaseDTO } from "./BaseDTO.js";

export const SOLICITACAO_STATUS = {
	aguardando: "Aguardando",
	alterado: "Alterado",
	aprovado: "Aprovado",
	recusado: "Recusado",
} as const;

export const SOLICITACAO_STATUS_VALUES = Object.keys(SOLICITACAO_STATUS) as TSolicitacaoStatus[];

export type TSolicitacaoStatus = keyof typeof SOLICITACAO_STATUS;
export type TSolicitacaoStatusLabel = (typeof SOLICITACAO_STATUS)[TSolicitacaoStatus];
export type TSolicitacaoProjeto = {
	id: string;
	nome: string;
};

export interface ISolicitacaoDTO extends IBaseDTO {
	titulo: string;
	descricao: string;
	status: TSolicitacaoStatus;
	deleted_id: string;
	creator_id: string;
	projeto_id: string;
	projeto?: TSolicitacaoProjeto | null;
	getStatusLabel(): TSolicitacaoStatusLabel;
}

type TConstructorDTO = Omit<ISolicitacaoDTO, "status" | "getStatusLabel"> & { status?: TSolicitacaoStatus };

export class SolicitacaoDTO implements ISolicitacaoDTO {
	readonly id?: string | null;
	readonly created_at?: Date;
	readonly updated_at?: Date;
	readonly titulo: string;
	readonly descricao: string;
	readonly status: TSolicitacaoStatus;
	readonly deleted_id: string;
	readonly creator_id: string;
	readonly projeto_id: string;
	readonly projeto?: TSolicitacaoProjeto | null;

	constructor({
		id = null,
		created_at,
		updated_at,
		titulo,
		descricao,
		status = "aguardando",
		deleted_id,
		creator_id,
		projeto_id,
		projeto = null,
	}: TConstructorDTO) {
		this.id = id;
		this.titulo = titulo;
		this.descricao = descricao;
		this.status = status;
		this.deleted_id = deleted_id;
		this.creator_id = creator_id;
		this.projeto_id = projeto_id;
		this.projeto = projeto;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}

	getStatusLabel(): TSolicitacaoStatusLabel {
		return SOLICITACAO_STATUS[this.status];
	}
}
