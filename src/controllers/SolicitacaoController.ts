import type { Response, NextFunction } from "express";
import type { IAuthRequest } from "../middlewares/EnsureAuthMiddleware.js";
import type { ISolicitacaoService } from "../services/SolicitacaoService.js";
import { STATUS_CODE } from "../utils/constants/status-code.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import type { SolicitacaoDTO, TSolicitacaoStatus } from "../dto/SolicitacaoDTO.js";
import type { TPagePagination } from "../utils/helpers/pagePaginator.js";
import type { TListOrderingSolicitacao } from "../models/SolicitacaoModel.js";
import type { TTipoAlteracaoSolicitacao } from "../utils/constants/tipo-alteracao-solicitacao.js";

export type TCreateDTOBodySolicitacao = {
	titulo: string;
	descricao: string;
	projeto_id: string;
};

export type TUpdateDTOBodySolicitacao = {
	titulo?: string;
	descricao?: string;
	status?: TSolicitacaoStatus;
	tipo_alteracao: TTipoAlteracaoSolicitacao;
};

export type TRequestListQueryParamsSolicitacao = {
	status?: TSolicitacaoStatus;
	ordering?: TListOrderingSolicitacao;
} & Partial<TPagePagination>;

export type TRequestCreateSolicitacao = IAuthRequest<any, any, TCreateDTOBodySolicitacao>;

export type TRequestUpdateSolicitacao = IAuthRequest<{ id: string }, any, TUpdateDTOBodySolicitacao>;

type TRequestGetSolicitacao = IAuthRequest<{ id: string }>;

export type TRequestDeleteSolicitacao = IAuthRequest<{ id: string }>;

export type TRequestListSolicitacao = IAuthRequest<any, any, any, TRequestListQueryParamsSolicitacao>;

type TControllerConstructor = {
	solicitacaoService: ISolicitacaoService;
};

export class SolicitacaoController {
	private solicitacaoService: ISolicitacaoService;

	constructor({ solicitacaoService }: TControllerConstructor) {
		this.solicitacaoService = solicitacaoService;
	}

	async create(req: TRequestCreateSolicitacao, res: Response, next: NextFunction): Promise<void> {
		try {
			const { titulo, descricao, projeto_id } = req.body;
			const { usuarioId } = req;
			const solicitacao = await this.solicitacaoService.create({
				titulo,
				descricao,
				projeto_id,
				creator_id: String(usuarioId),
			});
			res.status(STATUS_CODE.CREATED).json({
				message: "Solicitação criada com sucesso",
				data: {
					id: solicitacao.id,
					titulo: solicitacao.titulo,
					descricao: solicitacao.descricao,
					status: {
						value: solicitacao.status,
						label: solicitacao.getStatusLabel(),
					},
					creator_id: solicitacao.creator_id,
					projeto_id: solicitacao.projeto_id,
					created_at: solicitacao.created_at,
					updated_at: solicitacao.updated_at,
				},
			});
		} catch (error) {
			next(error);
		}
	}

	async get(req: TRequestGetSolicitacao, res: Response, next: NextFunction): Promise<void> {
		try {
			const solicitacao = await this.solicitacaoService.get(req.params.id);
			if (!solicitacao) throw new NotFoundError("Solicitação não encontrada");
			res.status(STATUS_CODE.OK).json({
				message: "Solicitação encontrada com sucesso",
				data: this.formatarSolicitacao(solicitacao),
			});
		} catch (error) {
			next(error);
		}
	}

	async update(req: TRequestUpdateSolicitacao, res: Response, next: NextFunction): Promise<void> {
		try {
			const { tipo_alteracao, ...restData } = req.body;
			const solicitacao = await this.solicitacaoService.update(req.params.id, { tipo_alteracao, ...restData });
			res.status(STATUS_CODE.OK).json({
				message: "Solicitação atualizada com sucesso",
				data: this.formatarSolicitacao(solicitacao),
			});
		} catch (error) {
			next(error);
		}
	}

	async list(req: TRequestListSolicitacao, res: Response, next: NextFunction): Promise<void> {
		try {
			const { ordering = "updated_at__asc", page, perPage, ...queryFilters } = req.query;
			const pagination = { page: Number(page) || 1, perPage: Number(perPage) || 10 };
			const filters = queryFilters || {};
			const result = await this.solicitacaoService.list({ pagination, filters, ordering });
			res.status(STATUS_CODE.OK).json({
				message: "Usuários buscados com sucesso",
				data: {
					results: result.data.map((solicitacao) => this.formatarSolicitacao(solicitacao)),
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

	async delete(req: TRequestDeleteSolicitacao, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			const foiDeletado = await this.solicitacaoService.delete(id);
			if (foiDeletado) res.status(STATUS_CODE.NO_CONTENT).send();
			else res.status(STATUS_CODE.BAD_REQUEST).json({ message: "Erro ao deletar o solicitação" });
		} catch (error) {
			next(error);
		}
	}

	private formatarSolicitacao(solicitacao: SolicitacaoDTO) {
		return {
			id: solicitacao.id,
			titulo: solicitacao.titulo,
			descricao: solicitacao.descricao,
			status: {
				value: solicitacao.status,
				label: solicitacao.getStatusLabel(),
			},
			projeto: {
				id: solicitacao.projeto?.id,
				nome: solicitacao.projeto?.nome,
			},
			creator_id: solicitacao.creator_id,
			projeto_id: solicitacao.projeto_id,
			created_at: solicitacao.created_at,
			updated_at: solicitacao.updated_at,
		};
	}
}
