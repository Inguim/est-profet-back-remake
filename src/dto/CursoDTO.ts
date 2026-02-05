import type { IBaseDTO } from "./BaseDTO.js";

export interface ICursoDTO extends IBaseDTO {
	curso: string;
}

type TFields = Partial<ICursoDTO>;

export class CursoDTO implements ICursoDTO {
	id?: string | null;
	created_at?: Date;
	updated_at?: Date;
	curso: string = "";

	constructor(fields: TFields = {}) {
		Object.assign(this, fields);
	}
}
