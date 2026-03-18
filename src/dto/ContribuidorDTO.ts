import type { IGitHubAccountInfoDTO } from "../providers/GitHubProvider.js";
import type { IBaseDTO } from "./BaseDTO.js";

type TTiposContribuicaoContribuidor = {
	id: string;
	nome: string;
};

type TUsuarioContribuidor = {
	id: string;
	nome: string;
};

export interface IContribuidorDTO extends IBaseDTO {
	github_username: string;
	tipo_contribuicao: TTiposContribuicaoContribuidor;
	usuario: TUsuarioContribuidor;
	github_dados: IGitHubAccountInfoDTO | null;
}

type TConstructorDTO = Omit<IContribuidorDTO, "github_dados"> & Partial<Pick<IContribuidorDTO, "github_dados">>;

export class ContribuidorDTO implements IContribuidorDTO {
	readonly id?: string | null;
	readonly created_at?: Date;
	readonly updated_at?: Date;
	readonly github_username: string;
	readonly tipo_contribuicao: TTiposContribuicaoContribuidor;
	readonly usuario: TUsuarioContribuidor;
	github_dados: IGitHubAccountInfoDTO | null = null;

	constructor({
		id = null,
		created_at,
		updated_at,
		github_username,
		tipo_contribuicao,
		usuario,
		github_dados = null,
	}: TConstructorDTO) {
		this.id = id;
		this.github_username = github_username;
		this.tipo_contribuicao = tipo_contribuicao;
		this.usuario = usuario;
		if (github_dados) this.github_dados = github_dados;
		if (created_at) this.created_at = created_at;
		if (updated_at) this.updated_at = updated_at;
	}
}
