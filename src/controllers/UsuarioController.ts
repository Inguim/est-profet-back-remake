import type { Request, Response, NextFunction } from "express";
import { STATUS_CODE } from "../utils/constants/status-code.js";
import type { IUsuarioService, TCreateDTO as TCreateDTOUsuarioService } from "../services/UsuarioService.js";
import { NotFoundError } from "../errors/index.js";
import type { IAuthRequest } from "../middlewares/index.js";
import type { UsuarioAlunoDTO } from "../dto/UsuarioAlunoDTO.js";
import type { UsuarioProfessorDTO } from "../dto/UsuarioProfessorDTO.js";
import type { TUsuarioStatus, TUsuarioTipo } from "../dto/UsuarioDTO.js";
import type { TPagePagination } from "../utils/helpers/pagePaginator.js";
import type { TListOrderingUsuario } from "../models/UsuarioModel.js";

type TCreateDTOBase = {
	confirm_password: string;
};

export type TCreateDTO = TCreateDTOBase & TCreateDTOUsuarioService;

export type TUpdateDTO = {
	nome: string;
};

export type TRequestListQueryParamsUsuario = {
	nome__ilike?: string;
	status?: TUsuarioStatus;
	tipo?: TUsuarioTipo;
	ordering?: TListOrderingUsuario;
} & Partial<TPagePagination>;

type TRequestCreate = Request<any, any, TCreateDTO>;

type TRequestUpdate = Request<{ id: string }, any, TUpdateDTO>;

type TRequestGet = IAuthRequest<{ id: string }>;

export type TRequestListUsuario = Request<any, any, any, TRequestListQueryParamsUsuario>;

type TControllerConstructor = {
	usuarioService: IUsuarioService;
};

export class UsuarioController {
	private usuarioService: IUsuarioService;

	constructor({ usuarioService }: TControllerConstructor) {
		this.usuarioService = usuarioService;
	}

	async create(req: TRequestCreate, res: Response, next: NextFunction): Promise<void> {
		const { nome, email, tipo, password } = req.body;
		try {
			let usuario;
			if (tipo === "aluno") {
				const { curso_id, serie_id } = req.body;
				usuario = await this.usuarioService.create({ nome, email, tipo, password, curso_id, serie_id });
			} else {
				const { categoriaIds } = req.body;
				usuario = await this.usuarioService.create({ nome, email, tipo, password, categoriaIds });
			}
			res.status(STATUS_CODE.CREATED).json({
				message: "Usuário criado com sucesso",
				data: {
					id: usuario.id,
					nome: usuario.nome,
					email: usuario.email,
					tipo: usuario.tipo,
					status: usuario.status,
				},
			});
		} catch (error) {
			next(error);
		}
	}

	async update(req: TRequestUpdate, res: Response, next: NextFunction): Promise<void> {
		const { id } = req.params;
		try {
			const usuario = await this.usuarioService.get(id as string);
			if (!usuario) throw new NotFoundError("Usuário não encontrado");
			const { nome } = req.body;
			const updatedUsuario = await this.usuarioService.update(usuario.id as string, { nome });
			res.status(STATUS_CODE.OK).json({
				message: "Usuário atualizado com sucesso",
				data: {
					id: updatedUsuario.id,
					nome: updatedUsuario.nome,
					email: updatedUsuario.email,
					tipo: updatedUsuario.tipo,
					status: updatedUsuario.status,
				},
			});
		} catch (error) {
			next(error);
		}
	}

	async get(req: TRequestGet, res: Response, next: NextFunction): Promise<void> {
		try {
			const usuario = await this.usuarioService.get(req.params.id);
			if (!usuario) throw new NotFoundError("Usuário não encontrado");
			const { id, nome, email, tipo, status } = usuario;
			let data;
			if (tipo === "aluno") {
				const { curso, serie } = usuario as UsuarioAlunoDTO;
				data = {
					id,
					nome,
					email,
					tipo,
					status,
					curso: {
						id: curso.id,
						curso: curso.curso,
					},
					serie: {
						id: serie.id,
						serie: serie.serie,
					},
				};
			} else {
				const { categorias } = usuario as UsuarioProfessorDTO;
				data = {
					id,
					nome,
					email,
					tipo,
					status,
					categorias: categorias.map(({ id, nome }) => ({ id, nome })),
				};
			}
			res.status(STATUS_CODE.OK).json({
				message: "Usuário encontrado com sucesso",
				data,
			});
		} catch (error) {
			next(error);
		}
	}

	async list(req: TRequestListUsuario, res: Response, next: NextFunction): Promise<void> {
		try {
			const { ordering = "updated_at__asc", page, perPage, ...queryFilters } = req.query;
			const pagination = { page: Number(page) || 1, perPage: Number(perPage) || 10 };
			const filters = queryFilters || {};
			const result = await this.usuarioService.list({ pagination, filters, ordering });
			res.status(STATUS_CODE.OK).json({
				message: "Usuários buscados com sucesso",
				data: {
					results: result.data.map((projeto) => ({
						id: projeto.id,
						nome: projeto.nome,
						email: projeto.email,
						tipo: projeto.tipo,
						status: projeto.status,
					})),
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
