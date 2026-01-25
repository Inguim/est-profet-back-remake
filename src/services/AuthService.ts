import { PasswordService, TokenService, UsuarioService, type IPasswordService, type ITokenService } from "./index.js";
import { ValidationError } from "../errors/index.js";
import { defaultMessages as dm } from "../validators/index.js";

type TDTOLogin = {
	email: string;
	password: string;
};

interface IAuthService {
	login(dto: TDTOLogin): Promise<string>;
}

export class AuthService implements IAuthService {
	constructor(
		private passwordService: IPasswordService = new PasswordService(),
		private tokenService: ITokenService = new TokenService(),
	) {}

	async login(dto: TDTOLogin): Promise<string> {
		const usuarioService = new UsuarioService();
		const { id, email, admin, password } = await usuarioService.findOne({ email: dto.email });
		const senhasIguais = await this.passwordService.compare(dto.password, password);
		if (!senhasIguais) {
			throw new ValidationError({ credencias_invalidas: dm.credencias_invalidas });
		}
		const token = this.tokenService.create({ id, email, admin });
		return token;
	}
}
