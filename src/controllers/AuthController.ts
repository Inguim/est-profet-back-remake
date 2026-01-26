import type { Request, Response, NextFunction } from "express";
import { type IAuthService } from "../services/index.js";
import { STATUS_CODE } from "../utils/constansts/status-code.js";

type TLoginDTO = {
	email: string;
	password: string;
};

interface IRequestLogin extends Request {
	body: TLoginDTO;
}

export class AuthController {
	constructor(private authService: IAuthService) {}

	async login(req: IRequestLogin, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, password } = req.body;
			const { token, usuario } = await this.authService.login({ email, password });
			const { id, nome, admin, status, tipo } = usuario;
			res.status(STATUS_CODE.OK).send({
				message: "Login efetuado com sucesso!",
				data: {
					token,
					usuario: { id, nome, admin, status, tipo },
				},
			});
		} catch (error) {
			next(error);
		}
	}
}
