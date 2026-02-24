import type { Request, Response, NextFunction } from "express";
import type { IEstadoService } from "../services/index.js";
import { STATUS_CODE } from "../utils/constansts/status-code.js";

type TControllerConstructor = {
	estadoService: IEstadoService;
};

export class EstadoController {
	private estadoService: IEstadoService;

	constructor({ estadoService }: TControllerConstructor) {
		this.estadoService = estadoService;
	}

	async list(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const estados = await this.estadoService.list();
			res.status(STATUS_CODE.OK).json({
				message: "Estados buscados com sucesso",
				data: {
					count: estados.length,
					results: estados.map(({ id, estado }) => ({ id, estado })),
				},
			});
		} catch (error) {
			next(error);
		}
	}
}
