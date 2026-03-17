import type { Knex } from "knex";
import { ProjetoDTO, type IProjetoDTO, type TProjetoStatus } from "../dto/ProjetoDTO.js";
import type { TUsuarioProjetoRelacao, UsuarioProjetoDTO } from "../dto/UsuarioProjetoDTO.js";
import type { IUsuarioProjetoService } from "./UsuarioProjetoService.js";
import dbConnection from "../database/dbConfig.js";
import { ProjetoModel, type TProjetoListOrderBy, type TProjetoListWhere } from "../models/ProjetoModel.js";
import type { TPagePaginatedResponse, TPagePagination } from "../utils/helpers/pagePaginator.js";
import {
	ProjetoCompletoDTO,
	type IProjetoCategoria,
	type IProjetoCompletoDTO,
	type IProjetoEstado,
	type IProjetoMembroAluno,
	type IProjetoMembroProfessor,
	type TUsuarioProjetoRelacaoAluno,
	type TUsuarioProjetoRelacaoLabelAluno,
	type TUsuarioProjetoRelacaoLabelProfessor,
	type TUsuarioProjetoRelacaoProfessor,
} from "../dto/ProjetoCompletoDTO.js";
import type { IEstadoService } from "./EstadoService.js";
import type { ICategoriaService } from "./CategoriaService.js";
import type { CategoriaDTO } from "../dto/CategoriaDTO.js";
import type { EstadoDTO } from "../dto/EstadoDTO.js";
import type { IUsuarioService } from "./UsuarioService.js";
import { ProjetoEvents, type IProjetoEvents } from "../events/ProjetoEvents.js";

export type TCreateProjetoMembro = {
	user_id: string;
	relacao: TUsuarioProjetoRelacao;
};

type TListProjetoDTO = {
	filters?: TProjetoListWhere;
	pagination?: TPagePagination;
	ordering?: TProjetoListOrderBy;
};

type TCreateDTO = Omit<IProjetoDTO, "id" | "created_at" | "updated_at" | "status">;
type TUpdateDTO = Omit<IProjetoDTO, "id" | "created_at" | "updated_at" | "estado_id" | "categoria_id"> & {
	executer_id: string;
};

type TConstructorService = {
	connection?: Knex;
	usuarioService: IUsuarioService;
	usuarioProjetoService: IUsuarioProjetoService;
	estadoService: IEstadoService;
	categoriaService: ICategoriaService;
};

type TProjetosMembros = {
	alunos: IProjetoMembroAluno[];
	professores: IProjetoMembroProfessor[];
};

export interface IProjetoService {
	create(dto: TCreateDTO, membrosDTO: TCreateProjetoMembro[]): Promise<IProjetoDTO>;
	update(id: string, dto: TUpdateDTO): Promise<IProjetoDTO>;
	updateStatus(id: string, status: TProjetoStatus): Promise<IProjetoDTO>;
	get(id: string): Promise<IProjetoCompletoDTO>;
	delete(id: string): Promise<boolean>;
	list(filter?: TListProjetoDTO): Promise<TPagePaginatedResponse<IProjetoCompletoDTO>>;
}

export class ProjetoService implements IProjetoService {
	private connection: Knex;
	private model = ProjetoModel;
	private usuarioProjetoService: IUsuarioProjetoService;
	private estadoService: IEstadoService;
	private categoriaService: ICategoriaService;
	private usuarioService: IUsuarioService;
	private projetoEvents: IProjetoEvents = new ProjetoEvents();

	constructor({
		usuarioProjetoService,
		categoriaService,
		estadoService,
		usuarioService,
		connection = dbConnection,
	}: TConstructorService) {
		this.usuarioProjetoService = usuarioProjetoService;
		this.categoriaService = categoriaService;
		this.estadoService = estadoService;
		this.usuarioService = usuarioService;
		this.connection = connection;
	}

	async create(dto: TCreateDTO, membrosDTO: TCreateProjetoMembro[]): Promise<ProjetoDTO> {
		return this.connection.transaction(async (trx) => {
			const { nome, objetivo, categoria_id, conclusao, estado_id, introducao, metodologia, result_disc, resumo } = dto;
			const model = new this.model(trx);
			const projeto = await model.create({
				nome,
				objetivo,
				categoria_id,
				conclusao,
				estado_id,
				introducao,
				metodologia,
				result_disc,
				resumo,
				status: "analise",
			});
			await this.vincularMembros(String(projeto.id), membrosDTO, trx);
			return projeto;
		});
	}

	async update(id: string, dto: TUpdateDTO): Promise<ProjetoDTO> {
		const { nome, objetivo, introducao, conclusao, metodologia, result_disc, resumo, status, executer_id } = dto;
		const model = new this.model();
		const projeto = await model.update(id, {
			nome,
			objetivo,
			introducao,
			conclusao,
			metodologia,
			result_disc,
			resumo,
			status,
		});
		this.projetoEvents.updated(String(projeto.id), executer_id);
		return projeto;
	}

	async updateStatus(id: string, status: TProjetoStatus): Promise<ProjetoDTO> {
		const model = new this.model();
		const projeto = await model.update(id, { status });
		return projeto;
	}

	async get(id: string): Promise<ProjetoCompletoDTO> {
		const model = new this.model();
		const projeto = await model.get(id);
		const projetoCompleto = await this.getProjetoCompleto(projeto);
		return projetoCompleto;
	}

	async delete(id: string): Promise<boolean> {
		const model = new this.model();
		const projeto = await model.delete(id);
		return !projeto.id;
	}

	async list({
		filters,
		pagination = { page: 1, perPage: 5 },
		ordering = "updated_at__asc",
	}: TListProjetoDTO = {}): Promise<TPagePaginatedResponse<IProjetoCompletoDTO>> {
		const model = new this.model();
		const { data, count, page, perPage, totalPages } = await model.list(filters, pagination, ordering);
		const projetos: ProjetoCompletoDTO[] = [];
		for (const projeto of data) {
			const projetoCompleto = await this.getProjetoCompleto(projeto as ProjetoDTO);
			projetos.push(projetoCompleto);
		}
		return {
			data: projetos,
			count,
			page,
			perPage,
			totalPages,
		};
	}

	private async getProjetoCompleto(projeto: ProjetoDTO): Promise<ProjetoCompletoDTO> {
		const {
			categoria_id,
			estado_id,
			id,
			conclusao,
			introducao,
			metodologia,
			nome,
			objetivo,
			resumo,
			result_disc,
			created_at,
			updated_at,
		} = projeto;
		const categoria = await this.getCategoria(categoria_id);
		const estado = await this.getEstado(estado_id);
		const membros = await this.usuarioProjetoService.list(String(id));
		const { alunos, professores } = await this.getUsuarios(membros as UsuarioProjetoDTO[]);
		const projetoCompleto = new ProjetoCompletoDTO({
			nome,
			resumo,
			objetivo,
			conclusao,
			introducao,
			metodologia,
			result_disc,
			alunos,
			professores,
			categoria,
			estado,
			id: String(id),
			status: { value: projeto.status, label: projeto.getStatusLabel() },
			created_at: created_at as Date,
			updated_at: updated_at as Date,
		});
		return projetoCompleto;
	}

	private async getUsuarios(membros: UsuarioProjetoDTO[]): Promise<TProjetosMembros> {
		const alunos: IProjetoMembroAluno[] = [];
		const professores: IProjetoMembroProfessor[] = [];
		for (const membro of membros) {
			const usuario = await this.usuarioService.get(membro.user_id);
			if (usuario?.tipo === "aluno") {
				alunos.push({
					id: String(usuario.id),
					nome: usuario.nome,
					tipo: "aluno",
					relacao: {
						value: membro.relacao as TUsuarioProjetoRelacaoAluno,
						label: membro.getRelacaoLabel() as TUsuarioProjetoRelacaoLabelAluno,
					},
				});
			} else {
				professores.push({
					id: String(usuario?.id),
					nome: String(usuario?.nome),
					tipo: "professor",
					relacao: {
						value: membro.relacao as TUsuarioProjetoRelacaoProfessor,
						label: membro.getRelacaoLabel() as TUsuarioProjetoRelacaoLabelProfessor,
					},
				});
			}
		}
		return { alunos, professores };
	}

	private async getCategoria(categoria_id: string): Promise<IProjetoCategoria> {
		const { id, nome } = (await this.categoriaService.list({ id: [categoria_id] })).at(0) as CategoriaDTO;
		return {
			id: String(id),
			nome,
		};
	}

	private async getEstado(estado_id: string): Promise<IProjetoEstado> {
		const { id, estado } = (await this.estadoService.list({ id: [estado_id] })).at(0) as EstadoDTO;
		return {
			id: String(id),
			nome: estado,
		};
	}

	private async vincularMembros(projetoId: string, membros: TCreateProjetoMembro[], trx: Knex): Promise<void> {
		for (const membro of membros) {
			const { relacao, user_id } = membro;
			await this.usuarioProjetoService.create({ projeto_id: projetoId, user_id, relacao }, trx);
		}
	}

	// private async atualizarSolicitacao(projeto: ProjetoDTO, executer_id: string) {
	// 	await this.solicitacaoService.findOne({ projeto_id: String(projeto.id) }).then(async (solicitacao) => {
	// 		await this.solicitacaoService.update(String(solicitacao.id), {
	// 			status: "alterado",
	// 			tipo_alteracao: "alteracao_dados",
	// 		});
	// 		await this.notificacaoService.create({ solicitacao_id: String(solicitacao.id), user_id: executer_id });
	// 	});
	// }
}
