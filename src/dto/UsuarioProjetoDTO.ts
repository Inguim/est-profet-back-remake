import type { IBaseDTO } from "./BaseDTO.js";

export const USUARIO_PROJETO_STATUS = {
	coordenador: "Coordenador",
	coorientador: "Coorientador",
	orientador: "Orientador",
	bolsista: "Bolsista",
	voluntario: "Voluntário",
} as const;

export const USUARIO_PROJETO_STATUS_VALUES = Object.keys(USUARIO_PROJETO_STATUS) as TUsuarioProjetoStatus[];

export type TUsuarioProjetoStatus = keyof typeof USUARIO_PROJETO_STATUS;
export type TUsuarioProjetoStatusLabel = (typeof USUARIO_PROJETO_STATUS)[TUsuarioProjetoStatus];

export interface IUsuarioProjetoDTO extends IBaseDTO {
	relacao: TUsuarioProjetoStatus;
	user_id: string;
	projeto_id: string;
}

type TConstructorDTO = IUsuarioProjetoDTO;

export class UsuarioProjetoDTO implements IUsuarioProjetoDTO {
	readonly id?: string | null;
	readonly created_at?: Date;
	readonly updated_at?: Date;
	readonly relacao: TUsuarioProjetoStatus;
	readonly user_id: string;
	readonly projeto_id: string;

	constructor({ id = null, created_at, updated_at, relacao, user_id, projeto_id }: TConstructorDTO) {
		this.id = id;
		this.relacao = relacao;
		this.user_id = user_id;
		this.projeto_id = projeto_id;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}

	getRelacaoLabel(): TUsuarioProjetoStatusLabel {
		return USUARIO_PROJETO_STATUS[this.relacao];
	}
}
