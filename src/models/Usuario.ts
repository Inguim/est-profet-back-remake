import { BaseModel, type IBaseFields } from "./BaseModel.js";
import { hash } from "bcrypt";

export type TUsuarioTipo = "aluno" | "professor";
export type TUsuarioStatus = "aprovado" | "analise";

export interface IUsuario extends IBaseFields {
	nome: string;
	email: string;
	tipo: TUsuarioTipo;
	admin: boolean;
	status: TUsuarioStatus;
	password: string;
}

export class Usuario extends BaseModel<IUsuario> {
	nome = "";
	email = "";
	password = "";
	tipo = "aluno";
	status = "analise";
	admin = false;

	constructor(fields: Partial<IUsuario> = {}) {
		super({ tableName: "usuarios", tableTag: "Usuário", fields });
	}

	protected async beforeCreate(): Promise<void> {
		const { nome, email, tipo, password } = this;
		const hashedPassword = await this.hashPassword(password);
		Object.assign(this, { nome, email, tipo, password: hashedPassword });
	}

	private hashPassword(password: string): Promise<string> {
		return hash(password, 8);
	}
}
