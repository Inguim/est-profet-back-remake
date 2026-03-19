import type { IBaseDTO } from "./BaseDTO.js";

export interface INoticiaDTO extends IBaseDTO {
	nome: string;
	link: string;
}

export class NoticiaDTO implements INoticiaDTO {
	readonly id?: string | null;
	readonly created_at?: Date;
	readonly updated_at?: Date;
	readonly nome: string;
	readonly link: string;

	constructor({ id = null, created_at, updated_at, nome, link }: INoticiaDTO) {
		this.id = id;
		this.nome = nome;
		this.link = link;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}
}
