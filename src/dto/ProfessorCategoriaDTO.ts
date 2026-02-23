import type { IBaseDTO } from "./BaseDTO.js";

export interface IProfessorCategoriaDTO extends IBaseDTO {
	professor_id: string;
	categoria_id: string;
}

export class ProfessorCategoriaDTO implements IProfessorCategoriaDTO {
	readonly id?: string | null;
	readonly created_at?: Date;
	readonly updated_at?: Date;
	readonly professor_id: string;
	readonly categoria_id: string;

	constructor({ id = null, created_at, updated_at, professor_id, categoria_id }: IProfessorCategoriaDTO) {
		this.id = id;
		this.professor_id = professor_id;
		this.categoria_id = categoria_id;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}
}
