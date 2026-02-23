import type { ICategoriaDTO } from "./CategoriaDTO.js";
import type { IUsuarioDTO, TUsuarioStatus, TUsuarioTipo } from "./UsuarioDTO.js";

export interface IUsuarioProfessorDTO extends Omit<IUsuarioDTO, "password"> {
	categorias: ICategoriaDTO[];
}

export class UsuarioProfessorDTO implements IUsuarioProfessorDTO {
	readonly id?: string | null;
	readonly created_at?: Date;
	readonly updated_at?: Date;
	readonly nome: string;
	readonly email: string;
	readonly admin: boolean;
	readonly tipo: TUsuarioTipo = "professor";
	readonly status: TUsuarioStatus;
	readonly categorias: ICategoriaDTO[];

	constructor({
		id = null,
		created_at,
		updated_at,
		nome,
		email,
		admin = false,
		status = "analise",
		categorias,
	}: Omit<IUsuarioProfessorDTO, "tipo">) {
		this.id = id;
		this.nome = nome;
		this.email = email;
		this.admin = admin;
		this.status = status;
		this.categorias = categorias;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}
}
