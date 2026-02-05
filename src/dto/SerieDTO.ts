import type { IBaseDTO } from "./BaseDTO.js";

export interface ISerieDTO extends IBaseDTO {
	serie: string;
}

export class SerieDTO implements ISerieDTO {
	readonly id?: string | null;
	readonly created_at?: Date;
	readonly updated_at?: Date;
	readonly serie: string;

	constructor({ id = null, created_at, updated_at, serie = "" }: ISerieDTO) {
		this.id = id;
		this.serie = serie;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}
}
