import type { Request, Response, NextFunction } from "express";
import { UsuarioService } from "../services/UsuarioService.js";
import type { TUsuarioTipo } from "../dto/UsuarioDTO.js";

type CreateDTO = {
	nome: string;
	email: string;
	tipo: TUsuarioTipo;
	password: string;
	confirm_password: string;
};

interface IRequestCreate extends Request {
	body: CreateDTO;
}

interface IControllerConstructor {
	usuarioService: UsuarioService;
}

export class UsuarioController {
	private usuarioService: UsuarioService;

	constructor({ usuarioService }: IControllerConstructor) {
		this.usuarioService = usuarioService;
	}

	async create(req: IRequestCreate, res: Response, next: NextFunction): Promise<void> {
		const { nome, email, tipo, password } = req.body;
		try {
			const usuario = await this.usuarioService.create({ nome, email, tipo, password });

			res.status(201).json({
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
}
