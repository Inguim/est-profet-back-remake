import { UsuarioFactory, type IUsuarioFactory } from "./UsuarioFactory.js";
import { faker as f } from "@faker-js/faker";

export interface IUsuarioProfessorFactory extends IUsuarioFactory {
	categorias: string[];
}

export class UsuarioProfessorFactory extends UsuarioFactory {
	private categorias: string[];

	private constructor() {
		super();
		this.tipo = "professor";
		this.categorias = f.helpers.multiple(() => f.string.uuid(), { count: 2 });
	}

	public static create(): UsuarioProfessorFactory {
		return new UsuarioProfessorFactory();
	}

	build(): IUsuarioProfessorFactory {
		const { nome, email, password, tipo, status, admin, categorias, created_at, updated_at } = this;
		return {
			nome,
			email,
			password,
			admin,
			tipo,
			status,
			categorias,
			created_at,
			updated_at,
		};
	}

	withCategorias(categorias_ids: string[]) {
		this.categorias = categorias_ids;
		return this;
	}
}
