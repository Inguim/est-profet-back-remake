import type { Request, Response, NextFunction } from "express";
import type { TUsuarioTipo } from "../dto/UsuarioDTO.js";
import { STATUS_CODE } from "../utils/constansts/status-code.js";
import type { IUsuarioService } from "../services/UsuarioService.js";
import { NotFoundError } from "../errors/index.js";

type TCreateDTO = {
	nome: string;
	email: string;
	tipo: TUsuarioTipo;
	password: string;
	confirm_password: string;
};

type TUpdateDTO = {
	nome: string;
};

type TRequestCreate = Request<any, any, TCreateDTO>;

type TRequestUpdate = Request<{ id: string }, any, TUpdateDTO>;

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
			const usuario = await this.usuarioService.create({ nome, email, tipo, password });

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
}
