import type { IPasswordResetDTO, PasswordResetDTO } from "../dto/PasswordResetDTO.js";
import { PasswordResetModel } from "../models/PasswordResetModel.js";
import { dataExpirada } from "../utils/helpers/dataExpirada.js";
import type { IUsuarioService } from "./UsuarioService.js";
import { ExpiredTokenError } from "../errors/ExpiredTokenError.js";
import { PasswordResetEvents, type IPasswordResetEvents } from "../events/PasswordResetEvents.js";

export interface IPasswordResetService {
	create(email: string): Promise<IPasswordResetDTO | null>;
	reset(email: string, token: string, password: string): Promise<boolean>;
}

type TConstructorService = {
	usuarioService: IUsuarioService;
};

export class PasswordResetService implements IPasswordResetService {
	protected model = PasswordResetModel;
	private usuarioService: IUsuarioService;
	private passwordResetEvents: IPasswordResetEvents = new PasswordResetEvents();
	private EXPIRES_IN = 15 * 60 * 1_000; // 15 minutos

	constructor({ usuarioService }: TConstructorService) {
		this.usuarioService = usuarioService;
	}

	async create(email: string): Promise<PasswordResetDTO | null> {
		let usuario;
		try {
			usuario = await this.usuarioService.findOne({ email });
		} catch {
			usuario = null;
		}
		if (usuario === null) return null;
		const model = new this.model();
		const tokenExistente = await model.findOne(email);
		if (tokenExistente !== null) return tokenExistente;
		const passwordReset = await model.create({ email });
		this.passwordResetEvents.sendEmail(usuario.email, passwordReset.token);
		return passwordReset;
	}

	async reset(email: string, token: string, password: string): Promise<boolean> {
		const model = new this.model();
		const reset = await model.findOne(email, token);
		if (reset === null) return false;
		const tokenExpirou = this.tokenExpirou(reset.created_at);
		await model.delete(reset.email, reset.token);
		if (tokenExpirou) throw new ExpiredTokenError();
		const usuario = await this.usuarioService.findOne({ email });
		if (!usuario) return false;
		await this.usuarioService.updatePassword(String(usuario.id), password);
		await model.delete(reset.email, reset.token);
		return true;
	}

	private tokenExpirou(criacao: Date): boolean {
		return dataExpirada(criacao, this.EXPIRES_IN);
	}
}
