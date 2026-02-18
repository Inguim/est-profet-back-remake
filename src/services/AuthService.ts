import { type IPasswordService, type ITokenService, type IUsuarioService } from "./index.js";
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

interface TContructorService {
	passwordService: IPasswordService;
	tokenService: ITokenService;
	usuarioService: IUsuarioService;
}

export class AuthService implements IAuthService {
	private passwordService: IPasswordService;
	private tokenService: ITokenService;
	private usuarioService: IUsuarioService;

	constructor({ passwordService, tokenService, usuarioService }: TContructorService) {
		this.passwordService = passwordService;
		this.tokenService = tokenService;
		this.usuarioService = usuarioService;
	}

	async login(dto: TDTOLogin): Promise<TAuthenticated> {
		const usuario = await this.usuarioService.findOne({ email: dto.email });
		const { id, email, admin, password } = usuario;
		const senhasIguais = await this.passwordService.compare(dto.password, password);
		if (!senhasIguais) {
			throw new ValidationError({ credencias_invalidas: dm.credencias_invalidas });
		}
		const token = this.tokenService.create({ id, email, admin });
		return { token, usuario };
	}
}
