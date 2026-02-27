import type { IProjetoDTO, TProjetoStatus, TProjetoStatusLabel } from "./ProjetoDTO.js";
import type { TUsuarioProjetoRelacao, TUsuarioProjetoRelacaoLabel } from "./UsuarioProjetoDTO.js";

export interface IProjetoCategoria {
	id: string;
	nome: string;
}

export interface IProjetoEstado {
	id: string;
	nome: string;
}

export interface IProjetoStatus {
	value: TProjetoStatus;
	label: TProjetoStatusLabel;
}

export interface IProjetoMembroAluno {
	id: string;
	tipo: "aluno";
	nome: string;
	relacao: {
		value: Extract<TUsuarioProjetoRelacao, "bolsista" | "voluntario">;
		label: Extract<TUsuarioProjetoRelacaoLabel, "Bolsista" | "Voluntário">;
	};
}

export interface IProjetoMembroProfessor {
	id: string;
	nome: string;
	tipo: "professor";
	relacao: {
		value: Exclude<TUsuarioProjetoRelacao, "bolsista" | "voluntario">;
		label: Exclude<TUsuarioProjetoRelacaoLabel, "Bolsista" | "Voluntário">;
	};
}

export interface IProjetoCompletoDTO extends Required<Omit<IProjetoDTO, "status" | "categoria_id" | "estado_id">> {
	status: IProjetoStatus;
	categoria: IProjetoCategoria;
	estado: IProjetoEstado;
	alunos: IProjetoMembroAluno[];
	professores: IProjetoMembroProfessor[];
}

export class ProjetoCompletoDTO implements IProjetoCompletoDTO {
	readonly id: string | null;
	readonly created_at: Date;
	readonly updated_at: Date;
	readonly nome: string;
	readonly resumo: string;
	readonly introducao: string;
	readonly objetivo: string;
	readonly metodologia: string;
	readonly result_disc: string;
	readonly conclusao: string;
	readonly status: IProjetoStatus;
	readonly categoria: IProjetoCategoria;
	readonly estado: IProjetoEstado;
	readonly alunos: IProjetoMembroAluno[];
	readonly professores: IProjetoMembroProfessor[];

	constructor({
		id = null,
		created_at,
		updated_at,
		nome,
		resumo,
		introducao,
		objetivo,
		metodologia,
		result_disc,
		conclusao,
		status,
		categoria,
		estado,
		alunos,
		professores,
	}: IProjetoCompletoDTO) {
		this.id = id;
		this.nome = nome;
		this.resumo = resumo;
		this.introducao = introducao;
		this.objetivo = objetivo;
		this.metodologia = metodologia;
		this.result_disc = result_disc;
		this.conclusao = conclusao;
		this.status = status;
		this.categoria = categoria;
		this.estado = estado;
		this.alunos = alunos;
		this.professores = professores;
		this.created_at = created_at;
		this.updated_at = updated_at;
	}
}
