import type { IBaseDTO } from "./BaseDTO.js";

export interface ICursoDTO extends IBaseDTO {
	curso: string;
}

export class CursoDTO implements ICursoDTO {
	id?: string | null;
	created_at?: Date;
	updated_at?: Date;
	curso: string;

	constructor({ id = null, created_at, updated_at, curso }: ICursoDTO) {
		this.id = id;
		this.curso = curso;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}
}
