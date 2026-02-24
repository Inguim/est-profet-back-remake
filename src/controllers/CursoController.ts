import type { Request, Response, NextFunction } from "express";
import type { ICursoService } from "../services/index.js";
import { STATUS_CODE } from "../utils/constansts/status-code.js";

type TControllerConstructor = {
	cursoService: ICursoService;
};

export class CursoController {
	private cursoService: ICursoService;

	constructor({ cursoService }: TControllerConstructor) {
		this.cursoService = cursoService;
	}

	async list(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const cursos = await this.cursoService.list();
			res.status(STATUS_CODE.OK).json({
				message: "Cursos buscados com sucesso",
				data: {
					count: cursos.length,
					results: cursos,
				},
			});
		} catch (error) {
			next(error);
		}
	}
}
