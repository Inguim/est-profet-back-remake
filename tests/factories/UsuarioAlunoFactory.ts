import { UsuarioFactory, type IUsuarioFactory } from "./UsuarioFactory.js";
import { v4 as uuidV4 } from "uuid";

export interface IUsuarioAlunoFactory extends IUsuarioFactory {
	serie_id: string;
	curso_id: string;
}

export class UsuarioAlunoFactory extends UsuarioFactory {
	private serie_id: string;
	private curso_id: string;

	private constructor() {
		super("aluno");
		this.serie_id = uuidV4();
		this.curso_id = uuidV4();
	}

	public static create(): UsuarioAlunoFactory {
		return new UsuarioAlunoFactory();
	}

	build(): IUsuarioAlunoFactory {
		const { nome, email, password, tipo, status, admin, curso_id, serie_id, created_at, updated_at } = this;
		return {
			nome,
			email,
			password,
			admin,
			tipo,
			status,
			curso_id,
			serie_id,
			created_at,
			updated_at,
		};
	}

	withCurso(curso_id: string) {
		this.curso_id = curso_id;
		return this;
	}

	withSerie(serie_id: string) {
		this.serie_id = serie_id;
		return this;
	}
}
