import type { NextFunction, Response } from "express";
import type { INotificacaoService } from "../services/NotificacaoService.js";
import type { IAuthRequest } from "../middlewares/EnsureAuthMiddleware.js";
import { STATUS_CODE } from "../utils/constants/status-code.js";
import type { TNotificacaoListOrderBy } from "../models/NotificacaoModel.js";
import type { TPagePagination } from "../utils/helpers/pagePaginator.js";

export type TRequestListQueryParamsNotificacao = {
	visto?: boolean;
	solicitacao_id?: string;
	ordering?: TNotificacaoListOrderBy;
} & Partial<TPagePagination>;

type TRequestGetNotificacao = IAuthRequest<{ id: string }>;

type TRequestMarcarLidaNotificacao = IAuthRequest<{ id: string }>;

export type TRequestListNotificacao = IAuthRequest<any, any, any, TRequestListQueryParamsNotificacao>;

type TControllerConstructor = {
	notificacaoService: INotificacaoService;
};

export class NotificacaoController {
	private notificacaoService: INotificacaoService;

	constructor({ notificacaoService }: TControllerConstructor) {
		this.notificacaoService = notificacaoService;
	}

	async get(req: TRequestGetNotificacao, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const notificacao = await this.notificacaoService.get(id);
			res.status(STATUS_CODE.OK).json({
				message: "Notificação encontrada com sucesso",
				data: notificacao,
			});
		} catch (error) {
			next(error);
		}
	}

	async marcarLida(req: TRequestMarcarLidaNotificacao, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const notificacao = await this.notificacaoService.marcarLida(id);
			res.status(STATUS_CODE.OK).json({
				message: "Notificação atualizada com sucesso",
				data: notificacao,
			});
		} catch (error) {
			next(error);
		}
	}

	async list(req: TRequestListNotificacao, res: Response, next: NextFunction): Promise<void> {
		try {
			const { ordering = "updated_at__desc", page, perPage, ...queryFilters } = req.query;
			const pagination = { page: Number(page) || 1, perPage: Number(perPage) || 10 };
			const filters = queryFilters || {};
			const result = await this.notificacaoService.list({ pagination, filters, ordering });
			res.status(STATUS_CODE.OK).json({
				message: "Notificações buscadas com sucesso",
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
}
