import type { ICursoDTO } from "./CursoDTO.js";
import type { ISerieDTO } from "./SerieDTO.js";
import type { IUsuarioDTO, TUsuarioStatus, TUsuarioTipo } from "./UsuarioDTO.js";

export interface IUsuarioAlunoDTO extends IUsuarioDTO {
	curso: ICursoDTO;
	serie: ISerieDTO;
}

export class UsuarioAlunoDTO implements IUsuarioAlunoDTO {
	readonly id?: string | null;
	readonly created_at?: Date;
	readonly updated_at?: Date;
	readonly nome: string;
	readonly email: string;
	readonly admin: boolean;
	readonly tipo: TUsuarioTipo = "aluno";
	readonly status: TUsuarioStatus;
	readonly password: string;
	readonly curso: ICursoDTO;
	readonly serie: ISerieDTO;

	constructor({
		id = null,
		created_at,
		updated_at,
		nome,
		email,
		admin = false,
		status = "analise",
		password,
		curso,
		serie,
	}: Omit<IUsuarioAlunoDTO, "tipo">) {
		this.id = id;
		this.nome = nome;
		this.email = email;
		this.curso = curso;
		this.serie = serie;
		this.admin = admin;
		this.status = status;
		this.password = password;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}
}
