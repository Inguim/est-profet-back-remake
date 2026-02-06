import type { IBaseDTO } from "./BaseDTO.js";

export interface IAlunoDTO extends IBaseDTO {
	user_id: string;
	curso_id: string;
	serie_id: string;
}

export class AlunoDTO implements IAlunoDTO {
	readonly id?: string | null;
	readonly created_at?: Date;
	readonly updated_at?: Date;
	readonly user_id: string;
	readonly curso_id: string;
	readonly serie_id: string;

	constructor({ id = null, created_at, updated_at, user_id, curso_id, serie_id }: IAlunoDTO) {
		this.id = id;
		this.user_id = user_id;
		this.curso_id = curso_id;
		this.serie_id = serie_id;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}
}
