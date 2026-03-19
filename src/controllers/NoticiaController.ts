import type { Request, Response, NextFunction } from "express";
import { STATUS_CODE } from "../utils/constants/status-code.js";
import type { IAuthRequest } from "../middlewares/index.js";
import type { TPagePagination } from "../utils/helpers/pagePaginator.js";
import type { INoticiaService } from "../services/NoticiaService.js";

export type TCreateDTONoticiaController = {
	nome: string;
	link: string;
};

export type TUpdateDTONoticiaController = {
	nome: string;
	link: string;
};

export type TRequestListQueryParamsNoticia = {
	user_id?: string;
} & Partial<TPagePagination>;

type TRequestCreateNoticiaController = IAuthRequest<any, any, TCreateDTONoticiaController>;

type TRequestUpdateNoticiaController = IAuthRequest<{ id: string }, any, TUpdateDTONoticiaController>;

type TRequestGetNoticiaController = Request<{ id: string }>;

export type TRequestDeleteNoticiaController = IAuthRequest<{ id: string }>;

export type TRequestListNoticia = Request<any, any, any, TRequestListQueryParamsNoticia>;

type TControllerConstructor = {
	noticiaService: INoticiaService;
};

export class NoticiaController {
	private noticiaService: INoticiaService;

	constructor({ noticiaService }: TControllerConstructor) {
		this.noticiaService = noticiaService;
	}

	async create(req: TRequestCreateNoticiaController, res: Response, next: NextFunction): Promise<void> {
		try {
			const { usuarioId } = req;
			const { link, nome } = req.body;
			const noticia = await this.noticiaService.create({ link, nome, user_id: String(usuarioId) });
			res.status(STATUS_CODE.CREATED).json({
				message: "Notícia criada com sucesso",
				data: noticia,
			});
		} catch (error) {
			next(error);
		}
	}

	async update(req: TRequestUpdateNoticiaController, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			const { usuarioId } = req;
			const { link, nome } = req.body;
			const noticia = await this.noticiaService.update(id, { nome, link, user_id: String(usuarioId) });
			res.status(STATUS_CODE.OK).json({
				message: "Notícia atualizada com sucesso",
				data: noticia,
			});
		} catch (error) {
			next(error);
		}
	}

	async get(req: TRequestGetNoticiaController, res: Response, next: NextFunction): Promise<void> {
		try {
			const noticia = await this.noticiaService.get(req.params.id);
			res.status(STATUS_CODE.OK).json({
				message: "Notícia encontrada com sucesso",
				data: noticia,
			});
		} catch (error) {
			next(error);
		}
	}

	async delete(req: TRequestDeleteNoticiaController, res: Response, next: NextFunction): Promise<void> {
		try {
			const { id } = req.params;
			const foiDeletado = await this.noticiaService.delete(id);
			if (foiDeletado) res.status(STATUS_CODE.NO_CONTENT).send();
			else res.status(STATUS_CODE.BAD_REQUEST).json({ message: "Erro ao deletar o notícia" });
		} catch (error) {
			next(error);
		}
	}

	async list(req: TRequestListNoticia, res: Response, next: NextFunction): Promise<void> {
		try {
			const { page, perPage, ...queryFilters } = req.query;
			const pagination = { page: Number(page) || 1, perPage: Number(perPage) || 10 };
			const filters = queryFilters || {};
			const result = await this.noticiaService.list({ pagination, filters, ordering: "updated_at__desc" });
			res.status(STATUS_CODE.OK).json({
				message: "Notícias buscadas com sucesso",
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
