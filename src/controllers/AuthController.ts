import type { Request, Response, NextFunction } from "express";
import { type IAuthService, type IPasswordResetService } from "../services/index.js";
import { STATUS_CODE } from "../utils/constants/status-code.js";

type TLoginDTO = {
	email: string;
	password: string;
};

type TPasswordResetUpdateDTO = {
	email: string;
	token: string;
	newPassword: string;
};

type TRequestLogin = Request<any, any, TLoginDTO>;

type TRequestPasswordResetCreate = Request<any, any, { email: string }>;

type TRequestPasswordResetUpdate = Request<any, any, TPasswordResetUpdateDTO>;
export class AuthController {
	constructor(
		private authService: IAuthService,
		private passwordResetService: IPasswordResetService,
	) {}

	async login(req: TRequestLogin, res: Response, next: NextFunction): Promise<void> {
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

	async solicitarResetPassword(req: TRequestPasswordResetCreate, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email } = req.body;
			await this.passwordResetService.create(email);
			res.status(STATUS_CODE.NO_CONTENT).send();
		} catch (error) {
			next(error);
		}
	}

	async efetuarResetPassword(req: TRequestPasswordResetUpdate, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, newPassword, token } = req.body;
			await this.passwordResetService.reset(email, token, newPassword);
			res.status(STATUS_CODE.NO_CONTENT).send();
		} catch (error) {
			next(error);
		}
	}
}
