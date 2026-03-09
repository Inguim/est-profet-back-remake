import type { IBaseDTO } from "./BaseDTO.js";

export interface ITipoNotificacaoDTO extends IBaseDTO {
	nome: string;
}

export class TipoNotificacaoDTO implements ITipoNotificacaoDTO {
	readonly id?: string | null;
	readonly created_at?: Date;
	readonly updated_at?: Date;
	readonly nome: string;

	constructor({ id = null, created_at, updated_at, nome }: ITipoNotificacaoDTO) {
		this.id = id;
		this.nome = nome;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}
}
