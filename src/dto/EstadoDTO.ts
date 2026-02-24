import type { IBaseDTO } from "./BaseDTO.js";

export interface IEstadoDTO extends IBaseDTO {
	estado: string;
}

export class EstadoDTO implements IEstadoDTO {
	readonly id?: string | null;
	readonly created_at?: Date;
	readonly updated_at?: Date;
	readonly estado: string;

	constructor({ id = null, created_at, updated_at, estado }: IEstadoDTO) {
		this.id = id;
		this.estado = estado;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}
}
