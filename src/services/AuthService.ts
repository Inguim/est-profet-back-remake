import { PasswordService, TokenService, UsuarioService, type IPasswordService, type ITokenService } from "./index.js";
import { ValidationError } from "../errors/index.js";
import { defaultMessages as dm } from "../validators/index.js";
import type { UsuarioDTO } from "../dto/UsuarioDTO.js";

type TDTOLogin = {
	email: string;
	password: string;
};

type TAuthenticated = {
	token: string;
	usuario: UsuarioDTO;
};

export interface IAuthService {
	login(dto: TDTOLogin): Promise<TAuthenticated>;
}

export class AuthService implements IAuthService {
	constructor(
		private passwordService: IPasswordService = new PasswordService(),
		private tokenService: ITokenService = new TokenService(),
	) {}

	async login(dto: TDTOLogin): Promise<TAuthenticated> {
		const usuarioService = new UsuarioService();
		const usuario = await usuarioService.findOne({ email: dto.email });
		const { id, email, admin, password } = usuario;
		const senhasIguais = await this.passwordService.compare(dto.password, password);
		if (!senhasIguais) {
			throw new ValidationError({ credencias_invalidas: dm.credencias_invalidas });
		}
		const token = this.tokenService.create({ id, email, admin });
		return { token, usuario };
	}
}
