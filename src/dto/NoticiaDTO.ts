import type { IBaseDTO } from "./BaseDTO.js";

export interface INoticiaDTO extends IBaseDTO {
	nome: string;
	link: string;
	user_id: string;
}

export class NoticiaDTO implements INoticiaDTO {
	readonly id?: string | null;
	readonly created_at?: Date;
	readonly updated_at?: Date;
	readonly nome: string;
	readonly link: string;
	readonly user_id: string;

	constructor({ id = null, created_at, updated_at, nome, link, user_id }: INoticiaDTO) {
		this.id = id;
		this.nome = nome;
		this.link = link;
		this.user_id = user_id;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}
}
