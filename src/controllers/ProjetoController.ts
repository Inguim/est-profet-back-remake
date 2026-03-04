import type { NextFunction, Response, Request } from "express";
import type { IProjetoService, IUsuarioProjetoService, TCreateProjetoMembro } from "../services/index.js";
import type { IProjetoDTO, TProjetoStatus } from "../dto/ProjetoDTO.js";
import type { IAuthRequest } from "../middlewares/EnsureAuthMiddleware.js";
import { STATUS_CODE } from "../utils/constansts/status-code.js";
import { UsuarioSemAutorizacaoError } from "../errors/UsuarioSemAutorizacaoError.js";
import type { TProjetoListOrderBy } from "../models/ProjetoModel.js";
import type { TPagePagination } from "../utils/helpers/pagePaginator.js";

export type TRequestCreateProjetoDTO = {
	projeto: Omit<IProjetoDTO, "id" | "created_at" | "updated_at" | "status">;
	membros: TCreateProjetoMembro[];
};

export type TRequestUpdateProjetoDTO = {
	status: TProjetoStatus;
};

export type TRequestListQueryParamsProjeto = {
	status?: TProjetoStatus;
	categoria_id?: string;
	estado_id?: string;
	ordering?: TProjetoListOrderBy;
} & Partial<TPagePagination>;

export type TRequestCreateProjeto = IAuthRequest<any, any, TRequestCreateProjetoDTO>;

type TRequestGetProjeto = Request<{ id: string }>;

export type TRequestUpdateProjeto = IAuthRequest<{ id: string }, any, TRequestUpdateProjetoDTO>;

export type TRequestDeleteProjeto = IAuthRequest<{ id: string }>;

export type TRequestListProjeto = Request<any, any, any, TRequestListQueryParamsProjeto>;

type TControllerConstructor = {
	projetoService: IProjetoService;
	usuarioProjetoService: IUsuarioProjetoService;
};

export class ProjetoController {
	private projetoService: IProjetoService;
	private usuarioProjetoService: IUsuarioProjetoService;

	constructor({ projetoService, usuarioProjetoService }: TControllerConstructor) {
		this.projetoService = projetoService;
		this.usuarioProjetoService = usuarioProjetoService;
	}

	async create(req: TRequestCreateProjeto, res: Response, next: NextFunction): Promise<void> {
		try {
			const { projeto: projetoDTO, membros } = req.body;
			const { nome, objetivo, metodologia, introducao, conclusao, categoria_id, estado_id, result_disc, resumo } =
				projetoDTO;
			const projeto = await this.projetoService.create(
				{ nome, objetivo, metodologia, introducao, conclusao, categoria_id, estado_id, result_disc, resumo },
				membros,
			);
			res.status(STATUS_CODE.CREATED).json({
				message: "Projeto criado com sucesso",
				data: {
					id: projeto.id,
					nome: projeto.nome,
					resumo: projeto.resumo,
					introducao: projeto.introducao,
					objetivo: projeto.objetivo,
					metodologia: projeto.metodologia,
					result_disc: projeto.result_disc,
					conclusao: projeto.conclusao,
					status: projeto.status,
					categoria_id: projeto.categoria_id,
					estado_id: projeto.estado_id,
				},
			});
		} catch (error) {
			next(error);
		}
	}

	async get(req: TRequestGetProjeto, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			const projeto = await this.projetoService.get(id);
			res.status(STATUS_CODE.OK).json({
				message: "Projeto encontrado com sucesso",
				data: projeto,
			});
		} catch (error) {
			next(error);
		}
	}

	async update(req: TRequestUpdateProjeto, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			const { status } = req.body;
			const { usuarioId, usuarioAdmin } = req;
			await this.validarAutorizacao(String(usuarioId), id, usuarioAdmin as boolean);
			const projeto = await this.projetoService.updateStatus(id, status);
			res.status(STATUS_CODE.OK).send({
				message: "Projeto atualizado com sucesso",
				data: {
					id: projeto.id,
					nome: projeto.nome,
					resumo: projeto.resumo,
					introducao: projeto.introducao,
					objetivo: projeto.objetivo,
					metodologia: projeto.metodologia,
					result_disc: projeto.result_disc,
					conclusao: projeto.conclusao,
					status: projeto.status,
					categoria_id: projeto.categoria_id,
					estado_id: projeto.estado_id,
				},
			});
		} catch (error) {
			next(error);
		}
	}

	async delete(req: TRequestDeleteProjeto, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			const { usuarioId, usuarioAdmin } = req;
			await this.validarAutorizacao(String(usuarioId), id, usuarioAdmin as boolean);
			const foiDeletado = await this.projetoService.delete(id);
			if (foiDeletado) res.status(STATUS_CODE.NO_CONTENT).send();
			else res.status(STATUS_CODE.BAD_REQUEST).json({ message: "Erro ao deletar o projeto" });
		} catch (error) {
			next(error);
		}
	}

	async list(req: TRequestListProjeto, res: Response, next: NextFunction): Promise<void> {
		try {
			const { ordering = "updated_at__asc", page, perPage, ...queryFilters } = req.query;
			const pagination = { page: Number(page) || 1, perPage: Number(perPage) || 10 };
			const filters = queryFilters || {};
			const result = await this.projetoService.list({ pagination, filters, ordering });
			res.status(STATUS_CODE.OK).json({
				message: "Projetos buscados com sucesso",
				data: {
					results: result.data,
					page: result.page,
					perPage: result.perPage,
					count: result.count,
					totalPages: result.totalPages,
				},
			});
		} catch (error) {
			next(error);
		}
	}

	private async validarAutorizacao(usuarioId: string, projetoId: string, usuarioAdmin: boolean) {
		const usuarioNaoAdmin = usuarioAdmin === false;
		if (usuarioNaoAdmin) {
			const usuarioNaoPertence = (await this.usuarioProjetoService.pertenceAoProjeto(usuarioId, projetoId)) === false;
			if (usuarioNaoPertence) throw new UsuarioSemAutorizacaoError();
		}
	}
}
