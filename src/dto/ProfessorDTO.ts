import type { IBaseDTO } from "./BaseDTO.js";

export interface IProfessorDTO extends IBaseDTO {
	user_id: string;
}

export class ProfessorDTO implements IProfessorDTO {
	readonly id?: string | null;
	readonly created_at?: Date;
	readonly updated_at?: Date;
	readonly user_id: string;

	constructor({ id = null, created_at, updated_at, user_id }: IProfessorDTO) {
		this.id = id;
		this.user_id = user_id;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}
}
