import type { IEmailProvider } from "../providers/EmailProvider.js";

export interface IPasswordResetObserver {
	created(email: string, token: string): Promise<void>;
}

type TConstructorObserver = {
	emailProvider: IEmailProvider;
};

export class PasswordResetObserver implements IPasswordResetObserver {
	private emailProvider: IEmailProvider;

	constructor({ emailProvider }: TConstructorObserver) {
		this.emailProvider = emailProvider;
	}

	async created(email: string, token: string): Promise<void> {
		await this.emailProvider.send(email, `Token de confirmação: ${token}`);
	}
}
