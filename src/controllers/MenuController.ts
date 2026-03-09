import type { Request, Response, NextFunction } from "express";
import type { IMenuService } from "../services/index.js";
import { STATUS_CODE } from "../utils/constants/status-code.js";

type TControllerConstructor = {
	menuService: IMenuService;
};

export class MenuController {
	private menuService: IMenuService;

	constructor({ menuService }: TControllerConstructor) {
		this.menuService = menuService;
	}

	async list(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const menus = await this.menuService.list();
			res.status(STATUS_CODE.OK).json({
				message: "Menus buscados com sucesso",
				data: {
					count: menus.length,
					results: menus,
				},
			});
		} catch (error) {
			next(error);
		}
	}
}
