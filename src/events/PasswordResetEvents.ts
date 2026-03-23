import { eventBus } from "./index.js";

export interface IPasswordResetEvents {
	sendEmail(to: string, token: string): Promise<void>;
}

export class PasswordResetEvents implements IPasswordResetEvents {
	private eventEmitter = eventBus;

	async sendEmail(to: string, token: string) {
		this.eventEmitter.emit("passwordReset.sendEmail", { to, token });
	}
}
