import type { Request, Response, NextFunction } from "express";
import type { ITipoContribuicaoService } from "../services/index.js";
import { STATUS_CODE } from "../utils/constants/status-code.js";

type TControllerConstructor = {
	tipoContribuicao: ITipoContribuicaoService;
};

export class TipoContribuicaoController {
	private tipoContribuicao: ITipoContribuicaoService;

	constructor({ tipoContribuicao }: TControllerConstructor) {
		this.tipoContribuicao = tipoContribuicao;
	}

	async list(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const contribuicoes = await this.tipoContribuicao.list();
			res.status(STATUS_CODE.OK).json({
				message: "Tipos contribuição buscadas com sucesso",
				data: {
					count: contribuicoes.length,
					results: contribuicoes,
				},
			});
		} catch (error) {
			next(error);
		}
	}
}
