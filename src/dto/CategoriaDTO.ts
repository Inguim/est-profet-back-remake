import type { IBaseDTO } from "./BaseDTO.js";

export interface ICategoriaDTO extends IBaseDTO {
	nome: string;
	slug: string;
	descricao: string;
	menu_id: string;
}

export class CategoriaDTO implements ICategoriaDTO {
	readonly id?: string | null;
	readonly created_at?: Date;
	readonly updated_at?: Date;
	readonly nome: string;
	readonly slug: string;
	readonly descricao: string;
	readonly menu_id: string;

	constructor({ id = null, created_at, updated_at, nome, slug, descricao, menu_id }: ICategoriaDTO) {
		this.id = id;
		this.nome = nome;
		this.slug = slug;
		this.descricao = descricao;
		this.menu_id = menu_id;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}
}
