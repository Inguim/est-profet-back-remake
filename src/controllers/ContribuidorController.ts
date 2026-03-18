import type { NextFunction, Response } from "express";
import type { IAuthRequest } from "../middlewares/EnsureAuthMiddleware.js";
import type { IContribuidorService } from "../services/ContribuidorService.js";
import { STATUS_CODE } from "../utils/constants/status-code.js";

export type TRequestCreateContribuidorDTO = {
	github_username: string;
	tipo_contribuicao_id: string;
	user_id: string;
};

export type TRequestUpdateContribuidorDTO = {
	github_username: string;
	tipo_contribuicao_id: string;
};

export type TRequestCreateContribuidor = IAuthRequest<any, any, TRequestCreateContribuidorDTO>;

type TControllerConstructor = {
	contribuidorService: IContribuidorService;
};

export class ContribuidorController {
	private contribuidorService: IContribuidorService;

	constructor({ contribuidorService }: TControllerConstructor) {
		this.contribuidorService = contribuidorService;
	}

	async create(req: TRequestCreateContribuidor, res: Response, next: NextFunction): Promise<void> {
		try {
			const { github_username, tipo_contribuicao_id, user_id } = req.body;
			const {
				id,
				created_at,
				updated_at,
				github_username: github_name,
				tipo_contribuicao,
				usuario,
			} = await this.contribuidorService.create({ github_username, tipo_contribuicao_id, user_id });
			res.status(STATUS_CODE.CREATED).json({
				message: "Contribuidor criado com sucesso",
				data: {
					id,
					created_at,
					updated_at,
					tipo_contribuicao,
					usuario,
					github_username: github_name,
				},
			});
		} catch (error) {
			next(error);
		}
	}
}
