import type { TUsuarioStatus, TUsuarioTipo } from "../../src/dto/index.js";
import { UsuarioFactory } from "./UsuarioFactory.js";

export interface IUsuarioProfessorFactory {
	nome: string;
	email: string;
	tipo: TUsuarioTipo;
	status: TUsuarioStatus;
	admin: boolean;
	password: string;
	created_at: Date;
	updated_at: Date;
	// adicionar campos professor
}

export class UsuarioProfessorFactory extends UsuarioFactory {
	private constructor() {
		super();
		this.tipo = "professor";
	}

	public static create(): UsuarioProfessorFactory {
		return new UsuarioProfessorFactory();
	}

	build(): IUsuarioProfessorFactory {
		const { nome, email, password, tipo, status, admin, created_at, updated_at } = this;
		return {
			nome,
			email,
			password,
			admin,
			tipo,
			status,
			created_at,
			updated_at,
		};
	}
}
