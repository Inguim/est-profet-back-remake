import type { Request, Response, NextFunction } from "express";
import type { ISerieService } from "../services/index.js";
import { STATUS_CODE } from "../utils/constants/status-code.js";

type TControllerConstructor = {
	serieService: ISerieService;
};

export class SerieController {
	private serieService: ISerieService;

	constructor({ serieService }: TControllerConstructor) {
		this.serieService = serieService;
	}

	async list(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const cursos = await this.serieService.list();
			res.status(STATUS_CODE.OK).json({
				message: "Series buscadas com sucesso",
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
