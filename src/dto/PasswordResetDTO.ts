export interface IPasswordResetDTO {
	email: string;
	token: string;
	created_at: Date;
}

export class PasswordResetDTO implements IPasswordResetDTO {
	readonly email: string;
	readonly token: string;
	readonly created_at: Date;

	constructor({ email, token, created_at }: IPasswordResetDTO) {
		this.email = email;
		this.token = token;
		this.created_at = created_at;
	}
}
