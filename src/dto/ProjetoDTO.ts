import type { IBaseDTO } from "./BaseDTO.js";

export const PROJETO_STATUS = {
	analise: "Análise",
	alteracao: "Alteração",
	aprovado: "Aprovado",
} as const;

export const PROJETO_STATUS_VALUES = Object.keys(PROJETO_STATUS) as TProjetoStatus[];

export type TProjetoStatus = keyof typeof PROJETO_STATUS;
export type TProjetoStatusLabel = (typeof PROJETO_STATUS)[TProjetoStatus];

export interface IProjetoDTO extends IBaseDTO {
	nome: string;
	resumo: string;
	introducao: string;
	objetivo: string;
	metodologia: string;
	result_disc: string;
	conclusao: string;
	status: TProjetoStatus;
	categoria_id: string;
	estado_id: string;
}

type TConstructorDTO = Omit<IProjetoDTO, "status"> & { status?: TProjetoStatus };

export class ProjetoDTO implements IProjetoDTO {
	readonly id?: string | null;
	readonly created_at?: Date;
	readonly updated_at?: Date;
	readonly nome: string;
	readonly resumo: string;
	readonly introducao: string;
	readonly objetivo: string;
	readonly metodologia: string;
	readonly result_disc: string;
	readonly conclusao: string;
	readonly status: TProjetoStatus = "analise";
	readonly categoria_id: string;
	readonly estado_id: string;

	constructor({
		id = null,
		created_at,
		updated_at,
		nome,
		resumo,
		introducao,
		objetivo,
		metodologia,
		result_disc,
		conclusao,
		status = "analise",
		categoria_id,
		estado_id,
	}: TConstructorDTO) {
		this.id = id;
		this.nome = nome;
		this.resumo = resumo;
		this.introducao = introducao;
		this.objetivo = objetivo;
		this.metodologia = metodologia;
		this.result_disc = result_disc;
		this.conclusao = conclusao;
		this.status = status;
		this.categoria_id = categoria_id;
		this.estado_id = estado_id;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}

	getStatusLabel(): TProjetoStatusLabel {
		return PROJETO_STATUS[this.status];
	}
}
