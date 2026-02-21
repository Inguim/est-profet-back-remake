import type { IBaseDTO } from "./BaseDTO.js";
import type { ICategoriaDTO } from "./CategoriaDTO.js";

export interface IMenuDTO extends IBaseDTO {
	nome: string;
	url: string;
	categorias?: ICategoriaDTO[];
}

export class MenuDTO implements IMenuDTO {
	readonly id?: string | null;
	readonly created_at?: Date;
	readonly updated_at?: Date;
	readonly nome: string;
	readonly url: string;
	readonly categorias?: ICategoriaDTO[];

	constructor({ id = null, created_at, updated_at, nome, url, categorias }: IMenuDTO) {
		this.id = id;
		this.nome = nome;
		this.url = url;
		if (categorias) this.categorias = categorias;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}
}
