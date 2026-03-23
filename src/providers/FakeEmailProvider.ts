import type { IEmailProvider } from "./EmailProvider.js";

export class FakeEmailProvider implements IEmailProvider {
	async send(to: string, content: string): Promise<void> {
		console.log("E-mail enviado para: ", to);
		console.log("Conteúdo do e-mail: ", content);
	}
}
