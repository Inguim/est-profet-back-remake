import type { IBaseDTO } from "./BaseDTO.js";

export interface ICursoDTO extends IBaseDTO {
	curso: string;
}

type TFields = Omit<ICursoDTO, "id" | "created_at" | "updated_at">;

export class CursoDTO implements ICursoDTO {
	id?: string | null;
	created_at?: Date = new Date();
	updated_at?: Date = new Date();
	curso: string = "";

	constructor(fields: TFields = { curso: "" }) {
		Object.assign(this, fields);
	}
}
