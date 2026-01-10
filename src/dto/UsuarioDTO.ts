import type { IBaseDTO } from "./BaseDTO.js";

export const USUARIO_TIPOS = ["aluno", "professor"] as const;
export const USUARIO_STATUS = ["aprovado", "analise"] as const;

export type TUsuarioTipo = (typeof USUARIO_TIPOS)[number];
export type TUsuarioStatus = (typeof USUARIO_STATUS)[number];

export interface IUsuarioDTO extends IBaseDTO {
	nome: string;
	email: string;
	tipo: TUsuarioTipo;
	status: TUsuarioStatus;
	admin: boolean;
	password: string;
}

type TFields = Partial<Omit<IUsuarioDTO, "id" | "createdAt" | "updatedAt">>;

export class UsuarioDTO implements IUsuarioDTO {
	id: string | null = null;
	createdAt: Date = new Date();
	updatedAt: Date = new Date();
	nome = "";
	email = "";
	admin: boolean = false;
	tipo: TUsuarioTipo = "aluno";
	status: TUsuarioStatus = "analise";
	password: string = "";

	constructor(fields: TFields = {}) {
		Object.assign(this, fields);
	}
}
